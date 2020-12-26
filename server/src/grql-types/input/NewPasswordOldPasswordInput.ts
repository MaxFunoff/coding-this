import { InputType, Field } from 'type-graphql';


@InputType()
export class NewPasswordOldPasswordInput {
    @Field()
    oldPassword: string;
    @Field()
    newPassword: string;
}
