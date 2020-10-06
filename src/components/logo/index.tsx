import React from "react";
import { Image, ImageStyle } from "react-native";

interface Props {
  style?: ImageStyle;
}

export const Logo: React.FC<Props> = ({ style }) => {
  return (
    <Image
      source={require("../../assets/paygo.png")}
      style={{ width: 115, height: 70.06, ...style }}
    />
  );
};
