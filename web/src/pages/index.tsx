import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React, { useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { PostCard } from "../components/PostCard";
import { HeartIcon } from "../components/Icons/HeartIcon";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | number,
  });
  const [{ data, fetching, stale }] = usePostsQuery({
    variables: {
      ...variables,
    },
  });

  const handleScroll = () => {
    if (!data?.posts.hasMore) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setVariables({
        ...variables,
        cursor: data.posts.posts[data.posts.posts.length - 1].id,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <Layout>
      {!fetching && !data ? (
        <div>Failed to load posts, try again later</div>
      ) : (
        <Stack spacing="60px" width="50%" m="auto">
          {data?.posts.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      )}
      <Box mt={2} p={4} textAlign="center" fontSize="xl">
        {stale && "Loading..."}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
