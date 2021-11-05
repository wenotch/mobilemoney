import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import React from "react";
import paygo from "../images/paygo.png";
function Navbar() {
  var name = "Emmanuel";
  return (
    <Flex
      justifyContent="space-between"
      w="full"
      align="center"
      px="30px"
      py="15px"
      bg="white"
    >
      <Box width="50%">
        <Text color="#046494">Hi {`${name}`}</Text>
      </Box>
      <Image width="25%" src={`${paygo}`} alt="paygo logo" />
    </Flex>
  );
}

export default Navbar;
