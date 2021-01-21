import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { useCheckMeQuery, usePostQuery } from "../../generated/graphql";
import React, { FC } from "react";
import { Layout } from "../../components/Layout";
import { Box, Flex, Heading, Link, Tag, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { InputField } from "../../components/InputField";
import { Form, Formik } from "formik";
import { HeartIcon } from "../../components/Icons/HeartIcon";
import { StarIcon } from "../../components/Icons/StarIcon";

const Post: FC = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [{ data: meData }] = useCheckMeQuery();

  console.log(data);
  if (intId === -1) router.push("/");

  if (fetching) {
    return (
      <Layout>
        <Box textAlign="center">Loading...</Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box textAlign="center">{error.message}</Box>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box textAlign="center">Could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="10px"
        overflow="hidden"
      >
        <Flex direction="column">
          <Heading>{data.post.title}</Heading>
          <Text fontWeight="600" fontSize="15px" color="#4D4D4D">
            By{" "}
            <NextLink
              href="/user/[id]"
              passHref
              as={`/user/${data.post.creator.id}`}
            >
              <Link>{data.post.creator.displayname}</Link>
            </NextLink>
          </Text>
        </Flex>
        <Text mt={5}>{data.post.description}</Text>
        <Flex p={1}>
          <Box ml="auto">
            {data.post.tags?.map((tag: any, i: any) => (
              <Tag key={i} colorScheme="" mr={1}>
                #{tag}
              </Tag>
            ))}
          </Box>
        </Flex>
      </Box>
      <Flex mt={2}>
        <Box
          as="button"
          minWidth="75px"
          shadow="md"
          borderWidth="1px"
          borderRadius="5px"
          overflow="hidden"
          bg={data.post.voteStatus ? 'red.200' : 'gray.100'}
          p={1}
          mr={1}
        >
          <Flex width="100%" justifyContent='center'>
            <Text fontWeight="500" color="#1D1D1D" mr={1}>
              {data.post.likes}
            </Text>
            <Box
              style={{
                width: "25px",
              }}
              aria-label="Like Button"
            >
              <HeartIcon active={!!data.post.voteStatus} />
            </Box>
          </Flex>
        </Box>

        <Box
          as="button"
          minWidth="40px"
          shadow="md"
          borderWidth="1px"
          borderRadius="5px"
          overflow="hidden"
          bg={data.post.starStatus ? 'yellow.100' : 'gray.100'}
          p={1}
          mr={2}
        >
          <Flex width="100%" justifyContent='center'>
            <Box
              style={{
                width: "25px",
              }}
              aria-label="Like Button"
            >
              <StarIcon active={!!data.post.starStatus} />
            </Box>
          </Flex>
        </Box>
      </Flex>
      {meData?.checkMe && (
        <Box
          mt={5}
          p={5}
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
            <Form>
              <Text>Comment as {meData.checkMe.displayname}</Text>
              <InputField
                name="content"
                label=""
                placeholder="Share your thoughts"
                textarea
              />
            </Form>
          </Formik>
        </Box>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
