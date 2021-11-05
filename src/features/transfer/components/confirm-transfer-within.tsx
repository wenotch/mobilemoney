import { Button, Layout, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Interpreter } from "xstate";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Colors } from "../../../constants";
import { formatToMoney } from "../../../lib/utils";
import { globalStyles } from "../../../styles";
import {
  TransferWithinContext,
  TransferWithinEvent,
} from "../machine/transferWithinService";

interface Props {
  service: Interpreter<any, any, any>;
}

export const ConfirmTransferWithin: React.FC<Props> = ({ service }) => {
  const [current, send] = useService<
    TransferWithinContext,
    TransferWithinEvent
  >(service);

  const goBack = () => {
    send("BACK");
  };

  return (
    <Modal visible={current.matches({ transferForm: "confirmation" })}>
      <AppTopNavigation childScreen goBack={goBack} />
      <Layout style={{ flex: 1, backgroundColor: "#FFF", margin: 10 }}>
        <View
          style={{
            backgroundColor: Colors.blue,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Name</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {current.context.recipient.name}
              </Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Mobile Phone</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {current.context.recipient.phone}
              </Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Amount</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {`N${formatToMoney(
                  `${current.context.transferForm.amount}.00`
                )}`}
              </Text>
            </View>
          </View>
        </View>
      </Layout>
      <Button
        style={{ margin: 10 }}
        onPress={() => {
          send({
            type: "TRANSACTION_CONFIRMED",
            data: {
              recipient: current.context.recipient.customerCode,
              amount: current.context.transferForm.amount,
              PIN: current.context.transferForm.PIN,
              remark: current.context.transferForm.remark,
            },
          });
        }}
      >
        {!current.matches("initiatingTransfer")
          ? "Confirm Transfer"
          : "Please wait..."}
      </Button>
    </Modal>
  );
};

const style = StyleSheet.create({
  textColor: {
    color: Colors.white,
  },
});
