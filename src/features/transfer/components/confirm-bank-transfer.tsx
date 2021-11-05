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
  BankTransferContext,
  BankTransferEvent,
} from "../machine/bankTransferService";

interface Props {
  service: Interpreter<BankTransferContext, any, BankTransferEvent>;
}

export const ConfirmBankTransfer: React.FC<Props> = ({ service }) => {
  const [current, send] = useService(service);

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
              <Text style={style.textColor}>{current.context.form.name}</Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Account Number</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {current.context.form.accountNumber}
              </Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Bank</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {current.context.selectedBankName}
              </Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Amount</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {`N${formatToMoney(current.context.form.amount as string)}`}
              </Text>
            </View>
          </View>
        </View>
      </Layout>
      <Button
        style={{ margin: 10 }}
        onPress={() => {
          send({
            type: "TRANSFER_INITIATED",
          });
        }}
      >
        Initiate Transfer
      </Button>
    </Modal>
  );
};

const style = StyleSheet.create({
  textColor: {
    color: Colors.white,
  },
});
