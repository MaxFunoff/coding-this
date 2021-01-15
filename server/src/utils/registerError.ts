export const registerError = (err: any) => {
    // Duplicate Error code
    if (err.code === '23505') {

        // DisplayName duplicate
        if (err.detail.includes('displayname')) {
            return [
                {
                    field: 'displayname',
                    message: 'Display Name is already in use'
                },
            ]
        }        // Email duplicate
        else if (err.detail.includes('email')) {
            return [
                {
                    field: 'email',
                    message: 'Email is already in use'
                },
            ]
        }
    }

    return null
}
