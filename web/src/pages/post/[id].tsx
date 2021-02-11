import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { useCheckMeQuery, usePostQuery } from "../../generated/graphql";
import React, { FC, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { Box, Flex, Heading, Link, Tag, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { NewComment } from "../../components/NewComment";
import { ActionButtons } from "../../components/ActionButtons";

const Post: FC = () => {
  const router = useRouter();

  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1 || isNaN(intId),
    variables: {
      id: intId,
    },
  });
  const [{ data: meData }] = useCheckMeQuery();

  useEffect(() => {
    if (!fetching && !data?.post) {
      router.replace("/404");
    }
  }, [data]);

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
    return null;
  }

  return (
    <Layout>
      <Box width="50%" m='auto'>
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
        <ActionButtons post={data.post} />
        {meData?.checkMe && <NewComment checkMe={meData?.checkMe} />}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
