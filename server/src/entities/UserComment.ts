import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Post } from "./Post";
import { User } from "./User";
@ObjectType()
@Entity()
export class UserComment extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    content!: string;

    @Field()
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.userComments)
    creator: User;
    
    @ManyToOne(() => Post, post => post.comments)
    post: Post;
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
} 