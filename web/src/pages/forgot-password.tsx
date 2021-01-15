import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { FC, useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword: FC = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              <Box>
                Please check your email for instructions on how to reset your
                password.
              </Box>
              <NextLink href="/login" passHref>
                <Link color="blue.400">Go back to Login page</Link>
              </NextLink>
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                label="Email"
                placeholder="Michael@email.com"
                type="email"
              />

              <Button
                mt={4}
                type="submit"
                bg="blue.400"
                colorScheme="blue"
                color="white"
                isLoading={isSubmitting}
                loadingText="Sending Email..."
              >
                Send Email
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
