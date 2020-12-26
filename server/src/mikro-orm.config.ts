import { __prod__ } from "./constants";
import { MikroORM } from '@mikro-orm/core'
import path from 'path';
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, Comment, User],
    dbName: 'ct-db',
    user: 'maxfu',
    password: '1475963',
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];