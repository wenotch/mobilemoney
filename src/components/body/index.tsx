import { Layout } from "@ui-kitten/components";
import React from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  style?: ViewStyle;
}

export const Body: React.FC<Props> = (props) => {
  const { top } = useSafeAreaInsets();
  return (
    <Layout style={{ ...props.style, flex: 1, paddingTop: top }} level="3">
      {props.children}
    </Layout>
  );
};
