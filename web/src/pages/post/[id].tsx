import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import React, { FC } from "react";
import { Layout } from "../../components/Layout";
import { Box } from "@chakra-ui/react";

const Post: FC = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{data, fetching, stale}] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (intId === -1) router.push("/");

  console.log(data)
  return (
    <Layout>
      {!fetching && !data ? (
        <div>Failed to load posts, try again later</div>
      ) : (
        <>{data?.post?.description}</>
      )}
      <Box mt={2} p={4} textAlign="center" fontSize="xl">
        {fetching || (stale && "Loading...")}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
