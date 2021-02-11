import { Box, Flex, Heading, Tag, Text, Link, Divider } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  PostSnippetFragment,
  useReadMoreQuery,
  useStarMutation,
  useUpvoteMutation,
} from "../../generated/graphql";
import { HeartIcon } from "../Icons/HeartIcon";
import NextLink from "next/link";
import { StarIcon } from "../Icons/StarIcon";
import styles from "./PostCard.module.scss";
import { useRouter } from "next/router";
interface PostProps {
  post: PostSnippetFragment | any;
}

export const PostCard: FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const [, upvote] = useUpvoteMutation();
  const [, star] = useStarMutation();
  const [{ data }, readMore] = useReadMoreQuery({
    pause: true,
    variables: {
      id: post.id,
    },
  });

  const handleLike = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    upvote({
      postId: post.id,
    });
  };

  const handleStar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    star({
      postId: post.id,
    });
  };

  const handleReadMore = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    readMore({ id: post.id });
  };

  return (
    <Box
      p={5}
      key={post.id}
      shadow="lg"
      borderWidth="1px"
      borderRadius="10px"
      overflow="hidden"
      _hover={{
        borderColor: "#8D8D8D",
        cursor: "pointer",
      }}
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <Flex direction="column">
        <Text fontWeight="600" fontSize="12px" color="#5D5D5D">
          Posted by{" "}
          <NextLink href="/user/[id]" passHref as={`/user/${post.creator.id}`}>
            <Link>{post.creator.displayname}</Link>
          </NextLink>
        </Text>
        <Heading mt={1} fontSize="xl">
          {post.title}
        </Heading>
      </Flex>

      <Box mt={4}>
        <Text whiteSpace="pre-wrap">
          {data?.post?.description || post.descriptionSnippet.snippet}
          {post.descriptionSnippet.hasMore && !data?.post?.description && (
            <Link color="#0000EE" ml={2} onClick={handleReadMore}>
              Read More
            </Link>
          )}
        </Text>
      </Box>
      <Flex>
        <Box ml="auto">
          {post.tags?.map((tag: any, i: any) => (
            <Tag key={i} colorScheme="" mr={1}>
              #{tag}
            </Tag>
          ))}
        </Box>
      </Flex>

      <Divider m="10px 0" borderColor="#8D8D8D" />

      <Flex width="100%" justifyContent="center" alignItems='center' mb={-2}>
        {/* <Text fontWeight="500" color="#fff" mr={1}>
            {post.likes}
          </Text> */}
        <Flex
          className={styles.iconBtn}
          onClick={handleLike}
          aria-label="Like Button"
        >
          <Box maxWidth="25px">
            <HeartIcon active={!!post.voteStatus} />
          </Box>
          <Text className={styles.iconLabel}>Like</Text>
        </Flex>
        <Flex
          className={styles.iconBtn}
          onClick={handleStar}
          aria-label="Save Button"
        >
          <Box maxWidth="25px">
            <StarIcon active={!!post.starStatus} />
          </Box>
          <Text className={styles.iconLabel}>Save</Text>
        </Flex>

        <Flex
          className={styles.iconBtn}
          onClick={() => {}}
          aria-label="Save Button"
        >
          <Box maxWidth="25px">
            <StarIcon active={false} />
          </Box>
          <Text className={styles.iconLabel}>Comment</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
