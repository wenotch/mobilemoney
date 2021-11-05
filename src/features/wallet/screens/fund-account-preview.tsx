import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import React, { useContext, useEffect } from "react";
import { BackHandler, StatusBar, StyleSheet, View } from "react-native";
import NumberFormat from "react-number-format";
import { QueryStatus, useMutation } from "react-query";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Loader } from "../../../components/loader";
import { Success } from "../../../components/success";
import { Colors } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { chargeCard } from "../../../services/paymentService";
import { globalStyles } from "../../../styles";
import { fundAccountService } from "../fsm/fund-account-machine";

export const FundAccountPreview: React.FC = () => {
  const { currentUser } = useContext(SessionContext) as Session;
  const [currentState, send, service] = useService(fundAccountService);
  const { navigate } = useNavigation();

  const { amount, selectedCard } = currentState.context;

  const [chargeCardMutation, { status, data, error }] = useMutation(chargeCard);

  console.log(currentState.value);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        back();

        return true;
      }
    );

    return subscription.remove;
  }, []);

  useEffect(() => {
    switch (status) {
      case QueryStatus.Error:
        send({ type: "CHARGE_CARD_FAILED", data });
        break;

      case QueryStatus.Success:
        send({ type: "CHARGE_CARD_SUCCESS" });
        break;

      default:
        break;
    }
  }, [status]);

  const doChargeCard = async () => {
    await chargeCardMutation({ amount, methodId: selectedCard.id });

    send({
      type: "CHARGE_CARD_APPROVED",
    });
  };

  const back = () => {
    send({ type: "BACK" });
    navigate(AppRoutes.FUND_ACCOUNT_SELECT_CARD);
  };

  if (currentState.matches({ processCardPayment: "success" })) {
    return <Success />;
  }

  if (currentState.matches({ processCardPayment: "completed" })) {
    navigate(AppRoutes.HOME);
  }

  return (
    <Body>
      <StatusBar backgroundColor={Colors.seafoam} />
      <AppTopNavigation
        title="Confirm Transaction"
        goBack={back}
        childScreen
        style={{ backgroundColor: Colors.seafoam }}
      />

      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors.seafoam,
            padding: 20,
          }}
        >
          <View style={{ ...globalStyles.row, paddingTop: 10 }}>
            <View style={globalStyles.col}>
              <Text style={styles.title}>Account Holder</Text>
            </View>
            <View style={globalStyles.col}>
              <Text>{`${currentUser?.firstName} ${currentUser?.lastName}`}</Text>
            </View>
          </View>
          <View style={{ ...globalStyles.row, paddingTop: 10 }}>
            <View style={globalStyles.col}>
              <Text style={styles.title}>Amount</Text>
            </View>
            <View style={globalStyles.col}>
              <NumberFormat
                decimalScale={2}
                decimalSeparator="."
                thousandSeparator=","
                value={currentState.context.amount}
                renderText={(value) => <Text>{value}</Text>}
                displayType={"text"}
                prefix="N"
              />
            </View>
          </View>
        </View>
      </View>
      <Button style={{ margin: 10 }} status="success" onPress={doChargeCard}>
        Pay Securely
      </Button>

      <Loader
        visible={currentState.matches({ processCardPayment: "chargingCard" })}
      />
    </Body>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
