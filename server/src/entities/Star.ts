import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Star extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, user => user.stars)
    user: User;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => Post, post => post.stars)
    post: Post;
} 