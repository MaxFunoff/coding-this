import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import { COOKIE_MAME, FORGOT_PASSWORD_PREFIX } from '../constants';
import { EmailPasswordInput } from '../grql-types/input/EmailPasswordInput';
import { EmailDisplaynamePasswordInput } from '../grql-types/input/EmailDisplaynamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { registerError } from '../utils/registerError';
import { NewPasswordOldPasswordInput } from '../grql-types/input/NewPasswordOldPasswordInput';
import { UserResponse } from '../grql-types/object/UserResponse';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { validatePassword } from '../utils/validatePassword';
import { ResetPasswordEmail } from '../emails/ResetPasswordEmail'
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

    // change password via email
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('password') password: string,
        @Arg('token') token: string,
        @Ctx() { em, redis, req }: MyContext
    ): Promise<UserResponse> {
        const errors = validatePassword(password)
        if (errors) return { errors }

        const key = FORGOT_PASSWORD_PREFIX + token
        const userId = await redis.get(key)

        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "Token expired",
                    }
                ]
            }
        }

        const user = await em.findOne(User, { id: parseInt(userId) })
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "User no longer exists",
                    }
                ]
            }
        }

        user.password = await argon2.hash(password)
        await em.persistAndFlush(user)

        // Remove token from redis
        await redis.del(key)
        // Log in user after password change
        req.session.userId = user.id;

        return {
            user,
        }
    }

    // Change password as logged in user
    @Mutation(() => UserResponse)
    async changePasswordAsUser(
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

    // Forgot Password
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { em, redis }: MyContext
    ) {
        const user = await em.findOne(User, { email });

        // user doesnt exist
        if (!user) return true

        const token = v4();
        await redis.set(
            FORGOT_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 3
        ); // 3 hours

        sendEmail(email, ResetPasswordEmail(user.displayname, token))
        return true
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

}