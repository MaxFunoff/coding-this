import * as EmailValidator from 'email-validator';
import { EmailDisplaynamePasswordInput } from 'src/grql-types/input/EmailDisplaynamePasswordInput';

export const validateRegister = (options: EmailDisplaynamePasswordInput) => {
    const validEmail = EmailValidator.validate(options.email)
    const displayNameIsNotEmail = !EmailValidator.validate(options.displayname)

    if (!validEmail) {
        return [
            {
                field: 'email',
                message: 'Email is not valid'
            }
        ]

    }
    if (!displayNameIsNotEmail) {
        return [
            {
                field: 'displayname',
                message: 'DisplayName cannot be an email'
            },
        ]
    } else if (options.displayname.length < 5) {
        return [
            {
                field: 'displayname',
                message: 'DisplayName length must be greater then 4'
            },
        ]
    } else if (options.displayname.length > 14) {
        return [
            {
                field: 'displayname',
                message: 'DisplayName length must be less then 15'
            },
        ]
    }

    if (options.password.length <= 5) {
        return [
            {
                field: 'password',
                message: 'Password length must be greater then 5'
            },
        ]
    }

    return null;
}