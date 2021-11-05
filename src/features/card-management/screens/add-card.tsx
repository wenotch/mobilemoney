import { useNavigation } from "@react-navigation/native";
import { useService } from "@xstate/react";
import { isUndefined } from "lodash";
import React, { useContext } from "react";
import { View } from "react-native";
import PaystackWebView from "react-native-paystack-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Body } from "../../../components/body";
import { Loader } from "../../../components/loader";
import { paystackPK } from "../../../constants";
import { SessionContext } from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { addPaymentMethodService } from "../machine/add-payment-method-machine";

export const AddCard = () => {
  const { top } = useSafeAreaInsets();
  const { currentUser } = useContext(SessionContext);
  const { goBack, navigate } = useNavigation();
  const [current, sendParent] = useService(addPaymentMethodService);
  const [state, sendMsg] = useService(current.context.addCardRef as any);

  if (current.matches("cancelled") || current.matches("error")) {
    sendParent("back");
    goBack();
  }

  if (current.matches("success")) {
    sendParent("back");
    navigate(AppRoutes.SELECT_PAYMENT_METHODS);
  }

  return (
    <Body>
      <View style={{ flex: 1 }}>
        {!isUndefined((state.context as any).transaction) && (
          <PaystackWebView
            buttonText="Pay Now"
            showPayButton={false}
            channels={JSON.stringify(["card"])}
            paystackKey={paystackPK}
            amount={(state.context as any).transaction.amount}
            billingEmail={currentUser?.email}
            billingMobile={currentUser?.phone}
            billingName={`${currentUser?.firstName} ${currentUser?.lastName}`}
            ActivityIndicatorColor="green"
            SafeAreaViewContainer={{ marginTop: top }}
            SafeAreaViewContainerModal={{ marginTop: top, flex: 1 }}
            autoStart={true}
            onCancel={(e: any) => {
              sendMsg({
                type: "ADD_CARD.error",
                error: e,
              });
            }}
            onSuccess={(res: any) => {
              sendMsg("ADD_CARD.success");
            }}
            refNumber={(state.context as any).transaction.id}
          />
        )}
      </View>

      <Loader visible={state.matches("startCardVerification")} />
    </Body>
  );
};
