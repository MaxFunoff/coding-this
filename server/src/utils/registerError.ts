export const registerError = (err: any) => {
    // Duplicate Error code
    if (err.code === '23505') {
        // Email duplicate
        if (err.constraint === 'user_email_unique') {
            return [
                {
                    field: 'email',
                    message: 'Email is already in use'
                },
            ]

            // DisplayName duplicate
        } else if (err.constraint === 'user_displayname_unique') {
            return [
                {
                    field: 'displayname',
                    message: 'DisplayName is already in use'
                },
            ]

        }
    }

    return null
}