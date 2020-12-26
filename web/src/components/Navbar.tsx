import React, { FC } from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useCheckMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useCheckMeQuery({
    pause: isServer(),
  });
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.checkMe) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" ml="auto" mr={10}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white" mr={10}>
            Register
          </Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
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
  }

  return (
    <Flex bg="blue.400" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
