import React, { FC } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'

interface registerProps {

}



const Register: FC<registerProps> = ({ }) => {
    const router = useRouter()
    const [, register] = useRegisterMutation()

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values);
                    if (response.data?.register.errors) {
                        // If failed
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user) {
                        // If success
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='email'
                            label='Email'
                            placeholder='Michael@email.com'
                            type='email'
                        />
                        <Box mt={4}>
                            <InputField
                                name='password'
                                label='Password'
                                placeholder='****'
                                type='password'
                            />
                        </Box>
                        <Button
                            mt={4}
                            type='submit'
                            colorScheme="teal"
                            isLoading={isSubmitting}
                            loadingText="Signing Up"
                        >
                            Sign Up
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
};


export default Register