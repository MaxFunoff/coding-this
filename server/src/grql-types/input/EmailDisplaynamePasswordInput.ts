import { InputType, Field } from 'type-graphql';
import { EmailPasswordInput } from './EmailPasswordInput';


@InputType()
export class EmailDisplaynamePasswordInput extends EmailPasswordInput {
    @Field()
    displayname: string;
}
