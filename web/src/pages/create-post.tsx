import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { FC } from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();

  const [, createPost] = useCreatePostMutation();

  const handleSubmit = async (values: {title: string, description: string}) =>{
    const { error } = await createPost({ input: values });
    if (error?.message.includes("Not Authenticated")) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="Title"
              placeholder="Make a Hello World program using JS"
            />

            <Box mt={4}>
              <InputField
                name="description"
                label="Description"
                placeholder="..."
                textarea
              />
            </Box>

            <Button
              mt={2}
              type="submit"
              bg="blue.400"
              colorScheme="blue"
              color="white"
              isLoading={isSubmitting}
              loadingText="Submitting Post..."
            >
              Submit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: false})(CreatePost);
