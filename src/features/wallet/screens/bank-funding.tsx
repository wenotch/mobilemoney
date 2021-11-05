import { useNavigation } from "@react-navigation/native";
import { useService } from "@xstate/react";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import PaystackWebView from "react-native-paystack-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { paystackPK } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { chargeBankMachine } from "../fsm/charge-bank-machine";
import { fundAccountService } from "../fsm/fund-account-machine";

export const BankFunding: React.FC = () => {
  const [currentState, send] = useService(fundAccountService);
  const { currentUser } = useContext(SessionContext) as Session;
  const { navigate } = useNavigation();

  useEffect(() => {
    send("ACTOR_INITIALIZED", { actor: chargeBankMachine });
  }, []);

  const { top } = useSafeAreaInsets();

  if (currentState.matches("selectingPaymentMethod")) {
    navigate(AppRoutes.FUND_ACCOUNT);
  }

  return (
    <Body>
      <AppTopNavigation childScreen />
      <View style={{ flex: 1 }}>
        <PaystackWebView
          buttonText="Pay Now"
          showPayButton={false}
          channels={JSON.stringify(["bank"])}
          paystackKey={paystackPK}
          amount={(currentState.context as any).amount}
          billingEmail={currentUser?.email}
          billingMobile={currentUser?.phone}
          billingName={`${currentUser?.firstName} ${currentUser?.lastName}`}
          ActivityIndicatorColor="green"
          SafeAreaViewContainer={{ marginTop: top }}
          SafeAreaViewContainerModal={{ marginTop: top, flex: 1 }}
          autoStart={true}
          refNumber={`${new Date().getTime()}-${currentUser?.phone}`}
          onCancel={(e: any) => {
            send({
              type: "BANK_CHARGE_FAILED",
              data: e,
            });
          }}
          onSuccess={(res: any) => {
            send("BANK_CHARGED_SUCCESS");
          }}
        />
      </View>
    </Body>
  );
};
