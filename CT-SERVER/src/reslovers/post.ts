import { Post } from '../entities/Post';
import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';

@Resolver()
export class PostResolver {

    // fetch all posts
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {})
    }


    // fetch post with id
    @Query(() => Post, { nullable: true })
    post(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id })
    }


    // Create new post
    @Mutation(() => Post)
    async createPost(
        @Arg('description') description: string,
        @Arg('title') title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, { title, description })
        await em.persistAndFlush(post)
        return post
    }

    // Update post
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('description') description: string,
        @Arg('title') title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id })
        if (!post) return null
        if(typeof title !== "undefined"){
            post.title = title;
            post.description = description;
            await em.persistAndFlush(post)
        }
        return post
    }

}