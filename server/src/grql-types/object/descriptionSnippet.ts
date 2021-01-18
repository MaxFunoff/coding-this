import { ObjectType, Field } from 'type-graphql';



@ObjectType()
export class descriptionSnippet {
    @Field(() => String)
    snippet: string;

    @Field()
    hasMore: boolean;
}
