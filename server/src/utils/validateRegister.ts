import * as EmailValidator from 'email-validator';
import { EmailDisplaynamePasswordInput } from 'src/grql-types/input/EmailDisplaynamePasswordInput';
import { validatePassword } from './validatePassword';

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

    const pwErrors = validatePassword(options.password)
    if (pwErrors) return pwErrors

    return null;
}