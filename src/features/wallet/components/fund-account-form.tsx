import { useNavigation } from "@react-navigation/native";
import { Button, Input, Modal, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { useFormik } from "formik";
import { isUndefined } from "lodash";
import { ChargeCardRequest } from "paygo";
import React, { useEffect } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import * as Yup from "yup";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { Colors } from "../../../constants";
import { formatToMoney } from "../../../lib/utils";
import { fundAccountService } from "../fsm/fund-account-machine";

const validationSchema = Yup.object().shape<Partial<ChargeCardRequest>>({
  amount: Yup.string()
    .required()
    .test("minimum-deposit", "Amount must be at least N10.00", (value) => {
      if (isUndefined(value)) {
        return false;
      }

      const amount = parseFloat(value!.replace(",", ""));

      return !(amount < 10);
    })
    .label("Amount"),
});

export const FundAccountForm = () => {
  const navigation = useNavigation();
  const [currentState, send] = useService(fundAccountService);

  const onAmountChange = (value: string) => {
    const amount = formatToMoney(value);

    setFieldValue("amount", amount);
  };

  const {
    errors,
    touched,
    values,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik<Partial<ChargeCardRequest>>({
    validationSchema,
    initialValues: {},
    onSubmit(values) {
      const amount = Number((values.amount as string).replace(",", ""));
      send({
        type: "FORM_SUBMITTED",
        amount,
      });
    },
  });

  useEffect(() => {
    //TODO: Fix back navigation
    const subscription = navigation.addListener("beforeRemove", (e) => {
      send("BACK");

      e.preventDefault();

      if (e.defaultPrevented && !currentState.matches("form")) {
      }
    });

    if (!currentState.matches("form")) {
      navigation.removeListener("beforeRemove", (e) => {
        send("BACK");

        e.preventDefault();
      });
    }

    return subscription;
  }, [currentState.value]);

  return (
    <Modal
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      visible={currentState.matches("form")}
      onBackdropPress={() => {
        resetForm();
        send({
          type: "BACK",
        });
      }}
    >
      <KeyboardAvoidingView>
        <Container style={{ flex: 1 }}></Container>
        <View
          style={{
            backgroundColor: Colors.white,
            width: Dimensions.get("screen").width,
            marginBottom: 25,
          }}
        >
          <Input
            label={() => <Label title="Enter amount" />}
            style={styles.margin}
            keyboardType="decimal-pad"
            value={values.amount?.toString()}
            onChangeText={(value) => setFieldValue("amount", value)}
            caption={touched.amount && errors.amount ? errors.amount : ""}
            status={touched.amount && errors.amount ? "danger" : ""}
          />

          <Button
            status="success"
            style={styles.margin}
            onPress={() => handleSubmit()}
          >
            {() => <Text>PROCEED</Text>}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  margin: { marginLeft: 10, marginRight: 10, marginBottom: 5 },
});
