import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, ObjectType } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';
import * as EmailValidator from 'email-validator';

@InputType()
class UsernamePasswordInput {
    @Field()
    email: string
    @Field()
    password: string
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
    @Query(() => User, { nullable: true })
    async checkMe(
        @Ctx() { req,em }: MyContext
    ) {
       if(!req.session.userId) {
           return null
       }

       const user = await em.findOne(User, {id: req.session.userId})
       return user
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const validEmail = EmailValidator.validate(options.email)
        if (!validEmail) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: 'email is not valid'
                    }
                ]
            }
        }

        if (options.password.length <= 5) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'password length must be greater then 4'
                    },
                ],
            }
        }

        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            email: options.email,
            password: hashedPassword
        })

        try {
            await em.persistAndFlush(user)
        } catch (err) {
            if (err.code === '23505') {
                // duplicate username error
                return {
                    errors: [
                        {
                            field: 'email',
                            message: 'email is already in use'
                        },
                    ],
                }
            }
        }

        return {
            user
        };
    }


    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { email: options.email })
        if (!user) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: "email doesn't exist"
                    },
                ],
            }
        }

        const valid = await argon2.verify(user.password, options.password)
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'passowrd',
                        message: 'incorrect password'
                    },
                ],
            }
        }

        req.session.userId = user.id;
        return {
            user,
        };
    }

}