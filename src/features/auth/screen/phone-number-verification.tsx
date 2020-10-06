import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { Logo } from "../../../components/logo";
import { ScreenTitle } from "../../../components/screen-title";
import { Colors } from "../../../constants";
import { globalStyles } from "../../../styles";

interface Props {}

export const VerifyPhoneNumber: React.FC<Props> = ({}) => {
  return (
    <Body style={{ ...globalStyles.blueBackground }}>
      <Container
        style={{
          flex: 1,
          justifyContent: "space-around",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Logo />
          <ScreenTitle />
        </View>
        <View>
          <Text style={{ textAlign: "center", color: Colors.white }}>
            You will get an OTP via SMS.
          </Text>
          <Input style={globalStyles.input} placeholder="Enter OTP" />
          <Button style={{ marginTop: 10 }}>Verify</Button>
        </View>
      </Container>
    </Body>
  );
};
