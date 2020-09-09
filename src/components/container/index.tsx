import React from "react";
import { View, ViewStyle } from "react-native";

interface Props {
  style?: ViewStyle;
}

export const Container: React.FC<Props> = (props) => {
  return <View style={{ ...props.style, padding: 10 }}>{props.children}</View>;
};
