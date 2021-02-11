import { Box, Flex, Button, Heading, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { VR } from "../components/VR";
import { useRouter } from "next/router";

const FourOFour: FC = () => {
  const router = useRouter();
  return (
    <Flex
      as="main"
      p={5}
      textAlign="center"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box as="section" color="#404040" width="auto">
        <Heading as="div" size="4xl" letterSpacing={10} minHeight="25%">
          404
        </Heading>

        <VR height="50px" />

        <Text as="div" fontSize="3xl" height="25%">
          The page you were looking for was moved or doesn't exist.
        </Text>

        <VR color="#404040" height="40px" />

        <Text as="div" fontSize="2xl" height="25%">
          Let's get you back ;)
        </Text>

        <VR height="20px" />

        <Button
          bg="blue.600"
          colorScheme="blue"
          color="white"
          size="lg"
          borderRadius="5px"
          textTransform="uppercase"
          onClick={() => router.push("/")}
        >
          Back To Home
        </Button>
      </Box>
    </Flex>
  );
};

export default FourOFour;
