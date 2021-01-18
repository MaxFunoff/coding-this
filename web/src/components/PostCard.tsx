import { Box, Flex, Heading, Badge, Tag, Text, Button } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  Post,
  PostSnippetFragment,
  useUpvoteMutation,
} from "../generated/graphql";
import { HeartIcon } from "./Icons/HeartIcon";

interface PostProps {
  post: PostSnippetFragment;
}

export const PostCard: FC<PostProps> = ({ post }) => {
  const [, upvote] = useUpvoteMutation();
  const handleClick = () => {
    upvote({
      postId: post.id,
    });
  };
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
          <Heading fontSize="xl">{post.title}</Heading>
          <Box ml="auto">
            <Badge
              textTransform="none"
              variant="solid"
              bg="blue.400"
              fontSize="1rem"
              color="#fff"
            >
              {post.creator.displayname}
            </Badge>
          </Box>
        </Flex>
        <Text mt={4} whiteSpace="pre-wrap">
          {post.descriptionSnippet.snippet}
        </Text>
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
      <Flex justifyContent="center" alignItems="center" bg="blue.400" p={2}>
        <Text fontSize="20px" fontWeight="500" color="#fff" mr={2}>
          {post.likes}
        </Text>
        <a
          onClick={handleClick}
          style={{
            width: "25px",
            minWidth: "",
          }}
          aria-label="Like Button"
        >
          <HeartIcon clicked={!!post.voteStatus} />
        </a>
      </Flex>
    </Box>
  );
};
