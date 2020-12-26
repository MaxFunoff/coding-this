import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { COOKIE_MAME, SERVER_PORT, __prod__, __secret__ } from './constants';
import microConfig from './mikro-orm.config'
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './reslovers/post';
import { CommentResolver } from './reslovers/comment';
import { UserResolver } from './reslovers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

const main = async () => {
    console.time('main')
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

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
            resolvers: [PostResolver, CommentResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res, redis })
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