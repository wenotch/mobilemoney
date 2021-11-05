import { Text } from "@ui-kitten/components";
import React from "react";
import { Colors } from "../../constants";

interface Props {
  title: string;
}

export const Label: React.FC<Props> = ({ title }) => (
  <Text
    style={{
      color: Colors.black,
      fontSize: 15,
      paddingTop: 10,
    }}
  >
    {title}
  </Text>
);
