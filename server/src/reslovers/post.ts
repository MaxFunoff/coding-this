import { Post } from '../entities/Post';
import { Resolver, Query, Arg, Mutation, Ctx, UseMiddleware, Int, FieldResolver, Root, ObjectType, Field, Float } from 'type-graphql';
import { PostInput } from '../grql-types/input/PostInput';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';


@ObjectType()
class descriptionSnippet {
    @Field(() => String)
    snippet: string

    @Field()
    hasMore: boolean
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]

    @Field()
    hasMore: boolean
}


@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => descriptionSnippet)
    descriptionSnippet(@Root() root: Post) {
        const sizeLimit = 100;
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
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];
        if (cursor) replacements.push(cursor)

        const posts = await getConnection().query(
            `
        SELECT p.*, 
        json_build_object(
            'id', u.id,
            'displayname', u.displayname
            ) creator
        FROM post p
        INNER JOIN public.user u ON u.id = p."creatorId"
        ${cursor ? `WHERE p.id < $2` : ""}
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
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    createPost(
        @Arg('input') input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {

        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save();
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

}