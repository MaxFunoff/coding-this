import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Star } from "./Star";
import { Upvote } from "./Upvote";
import { User } from "./User";
import { UserComment } from "./UserComment";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    description!: string;

    @Field(() => [String], { nullable: true })
    @Column('text', { array: true, nullable: true })
    tags: string[];

    @Field()
    @Column()
    creatorId: number;

    @Field()
    @ManyToOne(() => User, user => user.posts)
    creator: User;

    @OneToMany(() => UserComment, userComment => userComment.post)
    comments: UserComment[];

    @OneToMany(() => Upvote, upvote => upvote.post)
    upvotes: Upvote[];

    @Field()
    @Column({ type: "int", default: 0 })
    likes!: number;

    @OneToMany(() => Star, star => star.post)
    stars: Star[];

    @Field(() => Int)
    voteStatus: number;

    @Field(() => Int)
    starStatus: number;
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
} 