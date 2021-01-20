import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Upvote } from "./Upvote";
import { Post } from "./Post";
import { UserComment } from "./UserComment";
import { Star } from "./Star";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Field()
    @Column({unique: true })
    displayname!: string;

    @Column()
    password!: string;

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @OneToMany(() => Upvote, upvote => upvote.user)
    upvotes: Upvote[];

    @OneToMany(() => Star, star => star.user)
    stars: Star[];

    @OneToMany(() => UserComment, userComment => userComment.creator)
    userComments: UserComment[]

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
} 