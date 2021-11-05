import { useNavigation } from "@react-navigation/native";
import { List, ListItem, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { PaymentMethodType } from "paygo";
import React, { useEffect } from "react";
import { BackHandler, ListRenderItem } from "react-native";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { ChevronArrowForward } from "../../../components/icons";
import { Colors } from "../../../constants";
import { AppRoutes } from "../../../navigator/app.route";
import { paymentMethodService } from "../../../services/payment-method-service";
import { addBankAccountMachine } from "../machine/add-bank-account-machine";
import { addCardMachine } from "../machine/add-card-machine";
import { addPaymentMethodService } from "../machine/add-payment-method-machine";

export const ListPaymentMethodType: React.FC = () => {
  const [currentState, send] = useService(addPaymentMethodService);
  const { navigate, goBack } = useNavigation();

  const paymentMethodTypes: PaymentMethodType[] = [
    {
      title: "Add Card",
      type: "card",
    },
  ];

  const addCardMachineRef = addCardMachine.withConfig({
    services: {
      startCardVerification: paymentMethodService.startCardVerification,
    },
  });

  const prev = () => {
    goBack();

    return undefined;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", prev);

    return BackHandler.removeEventListener("hardwareBackPress", prev);
  }, []);

  const renderItem: ListRenderItem<PaymentMethodType> = ({ item, index }) => {
    const selectPaymentType = (type: "card" | "bank_account") => {
      type === "card"
        ? send({ type: "PAYMENT_METHOD.add_card", actor: addCardMachineRef })
        : send({
            type: "PAYMENT_METHOD.add_bank_account",
            actor: addBankAccountMachine,
          });
    };

    if (currentState.matches("addCard")) {
      navigate(AppRoutes.ADD_CARD);
    }

    if (currentState.matches("addBankAccount")) {
      navigate(AppRoutes.ADD_BANK_ACCOUNT);
    }

    return (
      <ListItem
        title={item.title}
        onPress={() => selectPaymentType(item.type)}
        key={index}
        style={{
          borderBottomColor: Colors.darkGrey,
          borderBottomWidth: 1,
          padding: 10,
        }}
        accessoryRight={ChevronArrowForward}
      />
    );
  };

  return (
    <Body>
      <AppTopNavigation title="PAYMENT METHOD TYPE LIST" />
      <Container>
        <Text>Select the payment method to add</Text>
        <List
          renderItem={renderItem}
          data={paymentMethodTypes}
          style={{ marginTop: 20 }}
        />
      </Container>
    </Body>
  );
};
