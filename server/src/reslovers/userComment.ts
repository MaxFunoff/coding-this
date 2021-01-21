import { UserComment } from '../entities/UserComment';
import { Resolver, Query, Arg, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';


@Resolver()
export class UserCommentResolver {

    @Query(() => [UserComment], {nullable: true})
    comments(
    ): Promise<UserComment[] | null> {
        return UserComment.find()
    }

    @Query(() => [UserComment], {nullable: true})
    commentsByPost(
        @Arg('postId') postId: number,
    ): Promise<UserComment[] | undefined> {
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
        @Arg('postId') _postId: number,
        @Arg('content') content: string,
    ): Promise<UserComment> {

        return UserComment.create({ content }).save();
    }

    @Mutation(() => UserComment)
    @UseMiddleware(isAuth)
    async updateComment(
        @Arg('id') id: number,
        // Remember to change the underscore to stop typescript crying
        @Arg('content') content: string,
        @Ctx() {req}: MyContext
    ): Promise<UserComment | null> {
        const userId = req.session.userId
        const comment = await UserComment.findOne({id, creatorId: userId})
        if (!comment) return null
        if (typeof content !== "undefined") {
            await UserComment.update({ id, creatorId: userId }, { content })
        }
        return comment
    }

}