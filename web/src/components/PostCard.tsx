import { Box, Flex, Heading, Tag, Text, Link } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  PostSnippetFragment,
  useReadMoreQuery,
  useStarMutation,
  useUpvoteMutation,
} from "../generated/graphql";
import { HeartIcon } from "./Icons/HeartIcon";
import NextLink from "next/link";
import { StarIcon } from "./Icons/StarIcon";
interface PostProps {
  post: PostSnippetFragment | any;
}

export const PostCard: FC<PostProps> = ({ post }) => {
  const [, upvote] = useUpvoteMutation();
  const [, star] = useStarMutation();
  const [{ data }, readMore] = useReadMoreQuery({
    pause: true,
    variables:{
      id: post.id
    }
  });

  return (
    <Box
      key={post.id}
      shadow="lg"
      borderWidth="1px"
      borderRadius="10px"
      overflow="hidden"
    >
      <Box p={5}>
        <Flex>
          <Flex direction="column">
            <Heading fontSize="xl">
              <NextLink href="/post/[id]" passHref as={`/post/${post.id}`}>
                <Link>{post.title}</Link>
              </NextLink>
            </Heading>
            <Text fontWeight="600" fontSize="15px" color="#4D4D4D">
              By{" "}
              <NextLink
                href="/user/[id]"
                passHref
                as={`/user/${post.creator.id}`}
              >
                <Link color="#0000EE">{post.creator.displayname}</Link>
              </NextLink>
            </Text>
          </Flex>

          <a
            onClick={() => {
              star({
                postId: post.id,
              });
            }}
            style={{
              width: "25px",
              marginLeft: "auto",
            }}
            aria-label="favourite Button"
          >
            <StarIcon active={!!post.starStatus} />
          </a>
        </Flex>

        <Box mt={4}>
          <Text whiteSpace="pre-wrap">
            {data?.post?.description || post.descriptionSnippet.snippet}
            {post.descriptionSnippet.hasMore && !data?.post?.description && (
              <Link
                color="#0000EE"
                ml={2}
                onClick={() => readMore({ id: post.id })}
              >
                Read More
              </Link>
            )}
          </Text>
        </Box>
      </Box>
      <Flex p={1}>
        <Box ml="auto">
          {post.tags?.map((tag: any, i: any) => (
            <Tag key={i} colorScheme="" mr={1}>
              #{tag}
            </Tag>
          ))}
        </Box>
      </Flex>
      <Flex
        justifyContent="center"
        alignItems="center"
        bg="blue.400"
        p={2}
        textAlign="center"
      >
        <Text fontWeight="500" color="#fff" mr={1}>
          {post.likes}
        </Text>
        <a
          onClick={() => {
            upvote({
              postId: post.id,
            });
          }}
          style={{
            width: "25px",
            minWidth: "",
          }}
          aria-label="Like Button"
        >
          <HeartIcon active={!!post.voteStatus} />
        </a>
      </Flex>
    </Box>
  );
};
