import { Box, Button } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers } from "formik";
import { withUrqlClient } from "next-urql";
import React, { FC } from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";
import { validatePost } from "../utils/validatePost";
import { PostValues } from "../types/PostValues";
import { toErrorMap } from "../utils/toErrorMap";



const CreatePost: FC = () => {
  useIsAuth();
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();

  const handleSubmit = async (values: PostValues, { setErrors }: FormikHelpers<PostValues>) => {
    const [_values, errors] = validatePost(values)
    if(errors) return setErrors(errors)

    const {data, error} = await createPost({ input: _values! });
    
    if (error?.message.includes("Not Authenticated")) return router.push("/login")
    if (data?.createPost.errors) return setErrors(toErrorMap(data.createPost.errors));
  
    router.push("/");
  };

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", description: "", tags: "" }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="Title (max. 60)"
              placeholder="Make a Hello World program using JS"
              required
            />

            <Box mt={4}>
              <InputField
                name="description"
                label="Description (max. 1000)"
                placeholder="..."
                textarea
              />
            </Box>

            <Box mt={4}>
              <InputField
                name="tags"
                label="Tags (max. 6)"
                placeholder="Javascript, ReactJS"
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

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
