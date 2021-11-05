import React from "react";
import { View, ViewStyle } from "react-native";

interface Props {
  style?: ViewStyle;
}

export const Container: React.FC<Props> = (props) => {
  return (
    <View
      style={{ ...props.style, paddingLeft: 10, paddingRight: 10, flex: 1 }}
    >
      {props.children}
    </View>
  );
};
