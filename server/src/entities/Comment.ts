import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Comment {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: 'number' })
    postId!: number;

    @Field()
    @Property({ type: 'number' })
    userId!: number;

    @Field(() => String)
    @Property({ type: 'date' })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({ type: 'text' })
    content!: string;
} 