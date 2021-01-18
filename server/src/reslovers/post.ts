import { Post } from '../entities/Post';
import { Resolver, Query, Arg, Mutation, Ctx, UseMiddleware, Int, FieldResolver, Root } from 'type-graphql';
import { PostInput } from '../grql-types/input/PostInput';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection, Like } from 'typeorm';
import { descriptionSnippet } from '../grql-types/object/descriptionSnippet';
import { PaginatedPosts } from '../grql-types/object/PaginatedPosts';
import { validatePost } from '../utils/validatePost';
import { PostResponse } from '../grql-types/object/PostResponse'
import { Upvote } from '../entities/Upvote';

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
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if(req.session.userId) replacements.push(req.session.userId)
        let cursorIdx = 3;
        if (cursor){
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
            ${req.session.userId ?
                `(SELECT COUNT(*) FROM upvote WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"` :
                '0 as "voteStatus"'
            }
        FROM post p
        INNER JOIN public.user u ON u.id = p."creatorId"
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
    post(
        @Arg('id') id: number,
    ): Promise<Post | undefined> {
        return Post.findOne(id)
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

}