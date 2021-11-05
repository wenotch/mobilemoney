import { useNavigation, useRoute } from "@react-navigation/native";
import { ListItem } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import React, { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { ChevronArrowForward } from "../../../components/icons";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { FundAccountForm } from "../components/fund-account-form";
import { fundAccountService } from "../fsm/fund-account-machine";

export const SelectFundingMethod: React.FC = () => {
  const { currentUser } = useContext(SessionContext) as Session;
  const { name } = useRoute();
  const { navigate, goBack } = useNavigation();

  const [currentState, send] = useService(fundAccountService);

  useEffect(() => {
    send("RESET");
  }, []);

  if (currentState.matches("processCardPayment")) {
    navigate(AppRoutes.FUND_ACCOUNT_SELECT_CARD);
  }

  if (currentState.matches("processDirectDebit")) {
    navigate(AppRoutes.BANK_FUNDING);
  }

  return (
    <Body>
      <AppTopNavigation
        title="SELECT SOURCE"
        goBack={() => goBack()}
        childScreen
      />
      <Container>
        <View>
          <ListItem
            title="Credit/Debit Card"
            description="Fund wallet from credit/debit cards"
            style={{ ...style.listStyle }}
            accessoryRight={ChevronArrowForward}
            onPress={() =>
              send({
                type: "PAYMENT_METHOD_SELECTED",
                paymentMethod: "card",
              })
            }
          />

          <ListItem
            title="Direct Debit"
            description="Fund wallet from bank account"
            style={{ ...style.listStyle }}
            accessoryRight={ChevronArrowForward}
            onPress={() =>
              send({
                type: "PAYMENT_METHOD_SELECTED",
                paymentMethod: "bank",
              })
            }
          />

          {/* <ListItem
            title="Transfer"
            description="Transfer from your bank account"
            style={{ ...style.listStyle }}
            accessoryRight={ChevronArrowForward}
            onPress={() =>
              send({
                type: "PAYMENT_METHOD_SELECTED",
                paymentMethod: "transfer",
              })
            }
          /> */}
        </View>

        <FundAccountForm />
      </Container>
    </Body>
  );
};

const style = StyleSheet.create({
  listStyle: {
    marginBottom: 10,
    borderRadius: 10,
  },
});
