import { Box } from "@chakra-ui/layout";
import React from "react";
import { RootStateOrAny, useSelector } from "react-redux";

function QuickLinks() {
  const state = useSelector((state: RootStateOrAny) => state);
  const name = state.name;
  return <Box boxShadow="md" p="30px" mx="30px" mt="30px"></Box>;
}

export default QuickLinks;
