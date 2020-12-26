export const validatePassword = (pw: string) => {
    if (pw.length <= 5) {
        return [
            {
                field: 'password',
                message: 'Password length must be greater then 5'
            },
        ]
    }
    return null
}