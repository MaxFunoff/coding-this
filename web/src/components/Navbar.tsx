import React, { FC } from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useCheckMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";

export const Navbar: FC<{}> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useCheckMeQuery({
    pause: isServer(),
  });
  let side = null;
  let body = null;
  // data is loading
  if (!data?.checkMe) {
    side = (
      <>
        <NextLink href="/login" passHref>
          <Link color="white" ml="auto" mr={10}>
            Login
          </Link>
        </NextLink>

        <NextLink href="/register" passHref>
          <Link color="white" mr={10}>
            Register
          </Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    side = (
      <Flex>
        <Box color="white" mr={5}>
          {data.checkMe.displayname}
        </Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          color="white"
          variant="link"
          mr={5}
        >
          Logout
        </Button>
      </Flex>
    );

    body = (
      <>
        <NextLink href="/create-post" passHref>
          <Link color="white" ml="auto" mr={10}>
            New Post
          </Link>
        </NextLink>
      </>
    );
  }

  return (
    <Flex bg="blue.400" p={4} position="sticky" top={0} zIndex={2}>
      <Box>
        <NextLink href="/" passHref>
          <Link color="white" ml="auto" mr={10}>
            Home
          </Link>
        </NextLink>
        {body}
      </Box>
      <Box ml="auto">{side}</Box>
    </Flex>
  );
};
