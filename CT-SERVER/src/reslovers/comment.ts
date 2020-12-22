import { Comment } from '../entities/Comment';
import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';


@Resolver()
export class CommentResolver{

    @Query(()=> [Comment])
    comments(
        @Ctx(){ em }: MyContext 
    ): Promise<Comment[]>{
        return em.find(Comment, {})
    }

    @Query(()=> [Comment])
    commentsByPost(
        @Arg('postId') postId: number,
        @Ctx(){ em }: MyContext 
    ): Promise<Comment[]>{
        return em.find(Comment, { postId })
    }

}