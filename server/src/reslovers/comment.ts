import { Comment } from '../entities/Comment';
import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';


@Resolver()
export class CommentResolver {

    @Query(() => [Comment])
    comments(
        @Ctx() { em }: MyContext
    ): Promise<Comment[]> {
        return em.find(Comment, {})
    }

    @Query(() => [Comment])
    commentsByPost(
        @Arg('postId') postId: number,
        @Ctx() { em }: MyContext
    ): Promise<Comment[]> {
        return em.find(Comment, { postId })
    }

    @Query(() => [Comment])
    commentsByUser(
        @Arg('userId') userId: number,
        @Ctx() { em }: MyContext
    ): Promise<Comment[]> {
        return em.find(Comment, { userId })
    }

    @Query(() => [Comment])
    comment(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Comment[]> {
        return em.find(Comment, { id })
    }

    @Mutation(() => Comment)
    async createComment(
        @Arg('userId') userId: number,
        @Arg('postId') postId: number,
        @Arg('content') content: string,
        @Ctx() { em }: MyContext
    ): Promise<Comment | null> {
        
        /////////////////////////////////////////////////
        //Check if correct user tries to post a comment//
        /////////////////////////////////////////////////
        const comment = em.create(Comment, {userId, postId, content})
        await em.persistAndFlush(comment)

        return comment
    }

    @Mutation(() => Comment)
    async updateComment(
        @Arg('id') id: number,
        // Remember to change the underscore to stop typescript crying
        @Arg('userId') _userId: number,
        @Arg('content') content: string,
        @Ctx() { em }: MyContext
    ): Promise<Comment | null> {
        
        /////////////////////////////////////////////////
        //Check if correct user tries to edit a comment//
        /////////////////////////////////////////////////
        const comment = await em.findOne(Comment, { id })
        if (!comment) return null
        if(typeof content !== "undefined"){
            comment.content = content;
            await em.persistAndFlush(comment)
        }
        return comment
    }

}