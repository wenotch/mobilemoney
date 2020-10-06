import { useRoute } from "@react-navigation/native";
import { Text } from "@ui-kitten/components";
import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface Props {
  title?: string;
}

export const ScreenTitle: React.FC<Props> = ({ title }) => {
  const route = useRoute();

  return (
    <Text category="h1" style={{ color: Colors.white }}>
      {route.name ?? title}
    </Text>
  );
};
