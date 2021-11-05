import { useNavigation } from "@react-navigation/native";
import { Button, Icon, IconProps, Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import { Colors } from "../../constants";
import { AppRoutes } from "../../navigator/app.route";
import { Body } from "../body";

interface Props {
  message?: string;
}

const CheckCircleIcon = (props: IconProps) => (
  <Icon
    name="checkmark-circle"
    fill="green"
    {...props}
    width="200"
    height="200"
  />
);

export const Success: React.FC<Props> = ({ message }) => {
  const { navigate } = useNavigation();

  return (
    <Body>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          flex: 1,
          backgroundColor: Colors.white,
        }}
      >
        <CheckCircleIcon />
        <Text style={{ fontSize: 20 }}>
          {message || "Your transaction was successful"}
        </Text>
        <Button style={{ margin: 40 }} onPress={() => navigate(AppRoutes.HOME)}>
          OK
        </Button>
      </View>
    </Body>
  );
};
