import { Box, Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  Post,
  useStarMutation,
  useUpvoteMutation,
} from "../generated/graphql";
import { HeartIcon } from "./Icons/HeartIcon";
import { StarIcon } from "./Icons/StarIcon";

interface ActionButtonsProps {
  post: {
    __typename?: "Post" | undefined;
  } & Pick<
    Post,
    | "title"
    | "id"
    | "createdAt"
    | "updatedAt"
    | "likes"
    | "voteStatus"
    | "starStatus"
    | "tags"
    | "description"
  >;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ post }) => {
  const [, upvote] = useUpvoteMutation();
  const [, star] = useStarMutation();
  return (
    <Flex mt={2}>
      <Box
        as="button"
        minWidth="75px"
        shadow="md"
        borderWidth="1px"
        borderRadius="5px"
        overflow="hidden"
        bg={post.voteStatus ? "red.200" : "gray.100"}
        p={1}
        mr={1}
        onClick={() => upvote({ postId: post?.id as number })}
      >
        <Flex width="100%" justifyContent="center">
          <Text fontWeight="500" color="#1D1D1D" mr={1}>
            {post.likes}
          </Text>
          <Box
            style={{
              width: "25px",
            }}
            aria-label="Like Button"
          >
            <HeartIcon active={!!post.voteStatus} />
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
        bg={post.starStatus ? "yellow.100" : "gray.100"}
        p={1}
        mr={2}
        onClick={() => star({ postId: post?.id as number })}
      >
        <Flex width="100%" justifyContent="center">
          <Box
            style={{
              width: "25px",
            }}
            aria-label="Like Button"
          >
            <StarIcon active={!!post.starStatus} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
