import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  const token = typeof router.query.token === 'string' ? router.query.token : "";

  
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            password: values.password,
            token,
          });

          if (response.data?.changePassword.errors) {
            // If failed
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // If success
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="password"
              label="New Password"
              placeholder="****"
              type="password"
            />
            {tokenError && (
              <Flex>
                <Box mr={2} color="red.500">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">Resend Link</NextLink>
              </Flex>
            )}

            <Button
              mt={4}
              type="submit"
              bg="blue.400"
              colorScheme="blue"
              color="white"
              isLoading={isSubmitting}
              loadingText="Changing Password..."
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};


// @ts-ignore
export default withUrqlClient(createUrqlClient)(ChangePassword);
