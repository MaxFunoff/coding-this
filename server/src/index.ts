import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnection } from 'typeorm';
import { COOKIE_MAME, SERVER_PORT, __prod__, __secret__ } from './constants';
import { UserCommentResolver } from './reslovers/userComment';
import { PostResolver } from './reslovers/post';
import { UserResolver } from './reslovers/user';
import path from 'path';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { UserComment } from './entities/UserComment';
import { Upvote } from './entities/Upvote';
import { Star } from './entities/Star';

const main = async () => {
    console.time('main')

    const conn = await createConnection({
        type: 'postgres',
        database: 'wtc2',
        username: 'maxfu',
        password: '1475963',
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User, UserComment, Upvote, Star]
    })

    // Run Migration
    await conn.runMigrations();

    // Delete shizz
    // await Post.delete({}); // Deletes all Posts
    // await User.delete({}); // Deletes all Users
    // await UserComment.delete({}); // Deletes all Users Comments

    // // Deletes all Users Upvotes 
    // await Upvote.delete({}); 
    // await getConnection()
    //     .createQueryBuilder()
    //     .update(Post)
    //     .set({likes: 0})
    //     .execute()
    

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true
        })
    );

    app.use(
        session({
            name: COOKIE_MAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: __secret__, // secret in constants
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserCommentResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res, redis })
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    })

    app.listen(SERVER_PORT, () => {
        console.log('----------------')
        console.timeEnd('main')
        console.log('----------------')
        console.log(`✔️  Server started on port ${SERVER_PORT}`)
        console.log(`⭐ Access GraphQL Debugger http://localhost:${SERVER_PORT}/GraphQL`)
        console.log('---------------------------------------------------------')
    });
}

main().catch((err) => {
    console.log(err)
});