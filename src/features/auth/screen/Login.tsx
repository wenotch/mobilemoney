import { useRoute } from "@react-navigation/native";
import { Text } from "@ui-kitten/components";
import React from "react";
import { Image } from "react-native";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Colors } from "../../../constants";
import { globalStyles } from "../../../styles";

interface Props {}

export const Login: React.FC<Props> = (_props) => {
  const route = useRoute();
  return (
    <Body style={{ ...globalStyles.blueBackground }}>
      <Container
        style={{
          alignItems: "center",
        }}
      >
        <Image source={require("../../../assets/icon.png").default} />
        <Text category="h1" style={{ color: Colors.white }}>
          {route.name}
        </Text>
      </Container>
    </Body>
  );
};
