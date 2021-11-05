import { useNavigation } from "@react-navigation/native";
import { ListItem } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { ChevronArrowForward } from "../../../components/icons";
import { Title } from "../../../components/title";
import { AppRoutes } from "../../../navigator/app.route";

export const SelectRecipientType: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <Body>
      <AppTopNavigation title="SEND MONEY" />
      <Container>
        <Title
          heading="Select recipient category"
          style={{ textAlign: "center" }}
        />
        <ListItem
          title="To Bank Account"
          description="Send money to bank account using NUBAN account number"
          accessoryRight={ChevronArrowForward}
          style={[styles.recipientType]}
          onPress={() => navigate(AppRoutes.SEND_MONEY_TO_BANK_ACCOUNT)}
        />
        <ListItem
          title="To Phone Contact"
          description="Send money to contacts save on your phone"
          accessoryRight={ChevronArrowForward}
          style={[styles.recipientType]}
          onPress={() => navigate(AppRoutes.PHONE_CONTACT_TRANSFER)}
        />
        <ListItem
          title="To PayGo Wallet"
          description="Send money to a PayGo wallet"
          accessoryRight={ChevronArrowForward}
          style={[styles.recipientType]}
          onPress={() => navigate(AppRoutes.TRANSFER_WITHIN)}
        />
      </Container>
    </Body>
  );
};

const styles = StyleSheet.create({
  recipientType: {
    borderRadius: 5,
    marginBottom: 20,
  },
});
