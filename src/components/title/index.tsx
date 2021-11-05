import { Text } from "@ui-kitten/components";
import React from "react";
import { TextProps, TextStyle } from "react-native";
import { Colors } from "../../constants";

interface Props extends TextProps {
  heading: string;
  style?: TextStyle;
}

export const Title: React.FC<Props> = (props) => (
  <Text
    style={[
      {
        color: Colors.lightGrey,
        fontSize: 18,
        paddingBottom: 10,
        ...props.style,
      },
    ]}
  >
    {props.heading}
  </Text>
);
