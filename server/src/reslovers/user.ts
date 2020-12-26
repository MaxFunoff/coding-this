import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, ObjectType } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { COOKIE_MAME } from '../constants';
import { EmailPasswordInput } from './EmailPasswordInput';
import { EmailDisplaynamePasswordInput } from './EmailDisplaynamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { registerError } from '../utils/registerError';

@InputType()
class NewPasswordOldPasswordInput {
    @Field()
    oldPassword: string;
    @Field()
    newPassword: string;
}


@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]
    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {

    // Check if user logged in
    @Query(() => User, { nullable: true })
    async checkMe(
        @Ctx() { req, em }: MyContext
    ) {
        if (!req.session.userId) return null
        const user = await em.findOne(User, { id: req.session.userId })
        return user
    }

    // Forgot Password
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { em }: MyContext
    ) {
        const user = await em.findOne(User, { email });

    }
    // Register user
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: EmailDisplaynamePasswordInput,
        @Ctx() { req, em }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) return { errors }

        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            email: options.email,
            displayname: options.displayname,
            password: hashedPassword
        })

        try {
            await em.persistAndFlush(user)
            req.session.userId = user.id;

        } catch (err) {
            const errors = registerError(err)
            if (errors) return { errors }
        }
        
        return {
            user
        };
    }


    // Login user
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: EmailPasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { email: options.email })
        if (!user) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: "Email doesn't exist"
                    },
                ],
            }
        }

        const valid = await argon2.verify(user.password, options.password)
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Incorrect password'
                    },
                ],
            }
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise(resolve =>
            req.session.destroy(err => {
                res.clearCookie(COOKIE_MAME)
                if (err) {
                    resolve(false)
                    return
                }

                resolve(true)
            }));
    };


    // Change password
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('options') options: NewPasswordOldPasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (!req.session.userId) {
            return {
                errors: [
                    {
                        field: 'user',
                        message: 'User is not logged in'
                    }
                ]
            }
        }

        const user = await em.findOne(User, { id: req.session.userId })
        if (!user) {
            return {
                errors: [
                    {
                        field: 'user',
                        message: 'User is not found'
                    },
                ],
            }
        }

        const valid = await argon2.verify(user.password, options.oldPassword)
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'passowrd',
                        message: 'Incorrect password'
                    },
                ],
            }
        }
        user.password = await argon2.hash(options.newPassword)
        await em.persistAndFlush(user)
        return {
            user,
        };
    }

}