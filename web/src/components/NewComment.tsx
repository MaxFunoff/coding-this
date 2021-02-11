import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { FC } from "react";
import { User } from "../generated/graphql";
import { InputField } from "./InputField";

interface NewCommentProps {
  checkMe: {
    __typename?: "User" | undefined;
  } & {
    __typename?: "User" | undefined;
  } & Pick<User, "id" | "displayname" | "email">;
}

export const NewComment: FC<NewCommentProps> = ({ checkMe }) => {
  return (
    <Box
      mt={5}
      p={4}
      shadow="md"
      borderWidth="1px"
      borderRadius="10px"
      overflow="hidden"
    >
      <Formik
        initialValues={{ content: "" }}
        onSubmit={async (values, { setErrors }) => {
          // const response = await login({ options: values });
          // if (response.data?.login.errors) {
          //   // If failed
          //   setErrors(toErrorMap(response.data.login.errors));
          // } else if (response.data?.login.user) {
          //   // If success
          //   if (typeof router.query.next === "string") {
          //     router.push(router.query.next)
          //   } else {
          //     router.push("/");
          //   }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Text>Comment as {checkMe.displayname}</Text>
            <InputField
              name="content"
              label=""
              placeholder="Share your thoughts"
              textarea
            />
            <Flex>
              <Button
                mt={2}
                ml="auto"
                type="submit"
                bg="blue.400"
                colorScheme="blue"
                color="white"
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Comment
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
