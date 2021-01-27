import { Box, Flex, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FilterNav } from "../components/FilterNav/FilterNav";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard/PostCard";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const router = useRouter();

  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | number,
    page: router.query.page as null | string,
    orderby: router.query.orderby as null | string,
    cursorlike: null as null | number
  });

  const [{ data, fetching, stale }, fetchPost] = usePostsQuery({
    variables: {
      ...variables,
    },
  });

  const handleScroll = () => {
    if (!data?.posts.hasMore) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      const _variables = {...variables}
      _variables.cursor = data.posts.posts[data.posts.posts.length - 1].id
      if(router.query.sortby === 'rising'){
        _variables.cursorlike = data.posts.posts[data.posts.posts.length - 1].likes
      }
      setVariables({
        ..._variables,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  useEffect(() => {
      setVariables({...variables, cursor: null, cursorlike: null, page: router.query.page as null | string, orderby: router.query.orderby as null | string})
  }, [router]);

  return (
    <Layout>
      {!fetching && !data ? (
        <div style={{ textAlign: "center" }}>
          Failed to load posts, try again later
        </div>
      ) : (
        <>
          <Flex justifyContent="center" mb={4}>
            <FilterNav />
          </Flex>
          <Stack spacing="60px" width="50%" m="auto">
            {data?.posts.posts.map((post) => (
              <PostCard key={`${post.id}`} post={post} />
            ))}
          </Stack>
          <Box mt={2} p={4} textAlign="center" fontSize="xl">
            {stale && "Loading..."}
          </Box>
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
