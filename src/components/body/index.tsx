import { Layout } from "@ui-kitten/components";
import React from "react";
import { ViewStyle } from "react-native";

interface Props {
  style?: ViewStyle;
}

export const Body: React.FC<Props> = (props) => {
  return <Layout style={{ ...props.style, flex: 1 }}>{props.children}</Layout>;
};
