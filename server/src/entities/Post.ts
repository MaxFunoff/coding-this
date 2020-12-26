import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: 'number', nullable: true })
    userId!: number;

    @Field(() => String)
    @Property({ type: 'date' })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({ type: 'text' })
    title!: string;

    @Field()
    @Property({ type: 'text' })
    description!: string;
} 