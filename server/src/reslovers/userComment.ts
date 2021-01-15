import { UserComment } from '../entities/UserComment';
import { Resolver, Query, Arg, Mutation } from 'type-graphql';


@Resolver()
export class UserCommentResolver {

    @Query(() => [UserComment])
    comments(
    ): Promise<UserComment[]> {
        return UserComment.find()
    }

    @Query(() => [UserComment])
    commentsByPost(
        @Arg('postId') postId: number,
    ): Promise<UserComment[]> {
        return UserComment.find({ where: { postId } })
    }

    @Query(() => [UserComment])
    commentsByUser(
        @Arg('userId') userId: number,
    ): Promise<UserComment[]> {
        return UserComment.find({ where: { userId } })
    }

    @Query(() => UserComment)
    comment(
        @Arg('id') id: number,
    ): Promise<UserComment | undefined> {
        return UserComment.findOne(id)
    }

    @Mutation(() => UserComment)
    async createComment(
        @Arg('userId') _serId: number,
        @Arg('postId') _postId: number,
        @Arg('content') content: string,
    ): Promise<UserComment> {

        return UserComment.create({ content }).save();
    }

    @Mutation(() => UserComment)
    async updateComment(
        @Arg('id') id: number,
        // Remember to change the underscore to stop typescript crying
        @Arg('userId') _userId: number,
        @Arg('content') content: string,
    ): Promise<UserComment | null> {

        /////////////////////////////////////////////////
        //Check if correct user tries to edit a comment//
        /////////////////////////////////////////////////
        const comment = await UserComment.findOne(id)
        if (!comment) return null
        if (typeof content !== "undefined") {
            await UserComment.update({ id }, { content })
        }
        return comment
    }

}