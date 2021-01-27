import { Post } from '../entities/Post';
import { Resolver, Query, Arg, Mutation, Ctx, UseMiddleware, Int, FieldResolver, Root } from 'type-graphql';
import { PostInput } from '../grql-types/input/PostInput';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { descriptionSnippet } from '../grql-types/object/descriptionSnippet';
import { PaginatedPosts } from '../grql-types/object/PaginatedPosts';
import { validatePost } from '../utils/validatePost';
import { PostResponse } from '../grql-types/object/PostResponse'
import { Upvote } from '../entities/Upvote';
import { Star } from '../entities/Star';

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => descriptionSnippet)
    descriptionSnippet(@Root() root: Post) {
        const sizeLimit = 250;
        let snippet = root.description;
        let hasMore = false;

        if (snippet.length > sizeLimit) {
            snippet = snippet.slice(0, sizeLimit) + '...'
            hasMore = true
        }

        return { snippet, hasMore }
    }


    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, { nullable: true }) cursor: number | null,
        @Arg('page', () => String, { nullable: true }) page: string | null,
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const userId = req.session.userId;
        const replacements: any[] = [realLimitPlusOne];

        if (userId) replacements.push(userId)
        let cursorIdx = 3;
        if (cursor) {
            replacements.push(cursor)
            cursorIdx = replacements.length
        }

        const posts = await getConnection().query(
            `
        SELECT p.*, 
        json_build_object(
            'id', u.id,
            'displayname', u.displayname
            ) creator,
            ${userId ?
                `
                (SELECT COUNT(*) FROM upvote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus",
                (SELECT COUNT(*) FROM star WHERE "userId" = $2 AND "postId" = p.id) "starStatus"
                ` :
                `
                0 as "voteStatus",
                0 as "starStatus"
                `
            }
        FROM post p
        INNER JOIN public.user u ON u.id = p."creatorId"
        ${userId && page === 'saved' ?
                `
                INNER JOIN public.star s ON s."userId" = $2
                WHERE p.id = s."postId"
                ${cursor ? 'AND' : ""}
            `:
                ""
            }
        ${cursor ? `WHERE p.id < $${cursorIdx}` : ""}
        ORDER BY p.id DESC
        LIMIT $1
        `,
            replacements
        )

        return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne };
    }

    // fetch post with id
    @Query(() => Post, { nullable: true })
    async post(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<Post | undefined> {
        const replacements = [id]
        const userId = req.session.userId;
        if(userId) replacements.push(userId)
        
        const post = await getConnection().query(
            `
            SELECT p.*, 
        json_build_object(
            'id', u.id,
            'displayname', u.displayname
            ) creator,
            ${userId ?
                `
                (SELECT COUNT(*) FROM upvote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus",
                (SELECT COUNT(*) FROM star WHERE "userId" = $2 AND "postId" = p.id) "starStatus"
                ` :
                `
                0 as "voteStatus",
                0 as "starStatus"
                `
            }
        FROM post p
        INNER JOIN public.user u ON u.id = p."creatorId"       
        WHERE p.id = $1
        LIMIT 1
            `,
            replacements
        )

        return post[0]
    }


    // Create new post
    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('input') input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<PostResponse> {
        const errors = validatePost(input)
        if (errors.length != 0) {
            return { errors }
        }

        const post = await Post.create({
            ...input,
            creatorId: req.session.userId
        }).save();

        return { post }
    }

    // Update post
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('description') description: string,
        @Arg('title') title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne(id)
        if (!post) return null
        if (typeof title !== "undefined") {
            post.title = title;
            post.description = description;
            await Post.update({ id }, { title, description })
        }
        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean> {
        try {
            await Post.delete(id);
            return true;
        } catch (err) {
            return false
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async upvote(
        @Arg('postId', () => Int) postId: number,
        @Ctx() { req }: MyContext
    ) {
        const { userId } = req.session;
        const upvote = await Upvote.findOne({ where: { postId, userId } });

        await getConnection().transaction(async tm => {
            let value = 1;
            if (upvote) {
                value = -1;
                await tm.query(`
                    DELETE FROM upvote
                    WHERE "userId" = $1
                    AND "postId" = $2
                `, [userId, postId]);
            } else {
                await tm.query(`
                INSERT INTO upvote("userId","postId")
                VALUES($1, $2);
            `, [userId, postId]);
            }

            await tm.query(`
            UPDATE post
            SET likes = likes + $1
            WHERE id = $2;
            `, [value, postId])
        })

        return true
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async star(
        @Arg('postId', () => Int) postId: number,
        @Ctx() { req }: MyContext
    ) {
        const { userId } = req.session;
        if (!userId) return false;
        const star = await Star.findOne({ where: { postId, userId } });

        if (star) {
            Star.delete({ userId, postId })
        } else {
            Star.insert({ userId, postId })
        }

        return true
    }

}