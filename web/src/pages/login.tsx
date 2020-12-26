import React, { FC } from "react";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface loginProps {}

const Login: FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            // If failed
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // If success
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              label="Email"
              placeholder="Michael@email.com"
              type="email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="****"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
