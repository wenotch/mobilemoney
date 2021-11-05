import { useNavigation } from "@react-navigation/native";
import { useService } from "@xstate/react";
import React, { useContext } from "react";
import { View } from "react-native";
import PaystackWebView from "react-native-paystack-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Body } from "../../../components/body";
import { Loader } from "../../../components/loader";
import { paystackPK } from "../../../constants";
import { SessionContext } from "../../../lib/session/context/session-context";
import { addPaymentMethodService } from "../machine/add-payment-method-machine";

export const AddBankAccount = () => {
  const { top } = useSafeAreaInsets();
  const { currentUser } = useContext(SessionContext);
  const { goBack } = useNavigation();
  const [current, sendParent] = useService(addPaymentMethodService);

  const [state, send] = useService(current.context.addBankRef as any);

  if (current.matches("cancelled") || current.matches("error")) {
    sendParent("back");
    goBack();
  }

  if (current.matches("success")) {
    sendParent("back");
    goBack();
  }

  return (
    <Body>
      <View style={{ flex: 1 }}>
        <PaystackWebView
          buttonText="Pay Now"
          channels={JSON.stringify(["bank"])}
          showPayButton={false}
          paystackKey={paystackPK}
          amount={state.context.transaction.amount}
          billingEmail={currentUser?.email}
          billingMobile={currentUser?.phone}
          billingName={`${currentUser?.firstName} ${currentUser?.lastName}`}
          ActivityIndicatorColor="green"
          SafeAreaViewContainer={{ marginTop: top }}
          SafeAreaViewContainerModal={{ marginTop: top, flex: 1 }}
          autoStart={true}
          onCancel={(e: any) => {
            send({
              type: "ADD_BANK_ACCOUNT.error",
              error: e,
            });
          }}
          onSuccess={(res: any) => {
            send("ADD_BANK_ACCOUNT.success");
          }}
          refNumber={state.context.transaction.id}
        />
      </View>
      <Loader visible={current.matches("init")} />
    </Body>
  );
};
