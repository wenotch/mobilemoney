import { Button, Layout, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Interpreter } from "xstate";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Colors } from "../../../constants";
import { formatToMoney } from "../../../lib/utils";
import { globalStyles } from "../../../styles";

interface Props {
  service: Interpreter<any, any, any>;
}

export const ConfirmTransferToMobile: React.FC<Props> = ({ service }) => {
  const [current, send] = useService(service);

  const goBack = () => {};

  return (
    <Modal visible={current.matches({ transferRequestForm: "confirmation" })}>
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
              <Text
                style={style.textColor}
              >{`${current.context.transferForm.firstName} ${current.context.transferForm.lastName}`}</Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Mobile Phone</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {current.context.transferForm.phone}
              </Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>Email</Text>
            </View>
            <View style={globalStyles.col}>
              <Text style={style.textColor}>
                {current.context.transferForm.email}
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
                  current.context.transferForm.amount as string
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
            type: "SUBMITTED",
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
