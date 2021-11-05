import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "@ui-kitten/components";
import { useMachine } from "@xstate/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { transferApi, TransferToMobileRequest } from "../../../api/transferApi";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { Loader } from "../../../components/loader";
import { Success } from "../../../components/success";
import { AppRoutes } from "../../../navigator/app.route";
import { ConfirmTransferToMobile } from "../components/confirm-transfer-to-mobile";
import { phoneTransferService } from "../machine/phoneTransferService";

const validationSchema = Yup.object().shape<Partial<TransferToMobileRequest>>({
  PIN: Yup.string().length(4).required().label("PIN"),
  amount: Yup.string().required().label("Amount"),
  email: Yup.string().email().required().label("Email"),
  firstName: Yup.string().min(2).max(15).required().label("First name"),
  lastName: Yup.string().min(2).max(15).required().label("Last name"),
  phone: Yup.string().min(6).max(15).required().label("Mobile phone number"),
  remark: Yup.string().max(30).required().label("Remark"),
  transactionPin: Yup.string().length(4).required().label("Transaction pin"),
});

export const TransferToMobile = () => {
  const onSubmit = (values: TransferToMobileRequest) => {
    console.log(values);
    send({
      type: "PROCEED",
      transactionDetail: values,
    });
  };
  const { navigate } = useNavigation();

  const { top } = useSafeAreaInsets();

  const {
    errors,
    handleSubmit,
    setFieldValue,
    values,
  } = useFormik<TransferToMobileRequest>({
    onSubmit,
    initialValues: {} as TransferToMobileRequest,
    validationSchema,
  });

  const [mutate] = useMutation((form: TransferToMobileRequest) => {
    return transferApi.transferToMobile(form);
  });

  const [current, send, service] = useMachine(
    phoneTransferService.withConfig({
      services: {
        initiateTransfer(context, _event) {
          return mutate(context.transferForm);
        },
      },
    }),
    { devTools: true }
  );

  useEffect(() => {
    service.onTransition((state) => console.log(state.value));
  }, []);

  if (current.matches("success"))
    return <Success message="Your transfer was successful" />;

  if (current.matches("error")) {
    showMessage({
      message: current.context.error,
      type: "danger",
    });
  }

  if (current.matches("complete")) {
    navigate(AppRoutes.HOME);
  }

  return (
    <Body>
      <AppTopNavigation childScreen title="Transfer To Mobile" />
      <KeyboardAwareScrollView>
        <Container>
          <Text>Fill this form to send money to a mobile user.</Text>
          <Input
            label={() => <Label title="First Name" />}
            caption={errors.firstName ? errors.firstName : ""}
            status={errors.firstName ? "danger" : ""}
            onChangeText={(value) => setFieldValue("firstName", value)}
          />

          <Input
            label={() => <Label title="Last Name" />}
            caption={errors.lastName ? errors.lastName : ""}
            status={errors.lastName ? "danger" : ""}
            onChangeText={(value) => setFieldValue("lastName", value)}
          />

          <Input
            label={() => <Label title="Mobile Phone Number" />}
            caption={errors.phone ? errors.phone : ""}
            status={errors.phone ? "danger" : ""}
            onChangeText={(value) => setFieldValue("phone", value)}
            keyboardType="phone-pad"
          />

          <Input
            label={() => <Label title="Email" />}
            caption={errors.email ? errors.email : ""}
            status={errors.email ? "danger" : ""}
            onChangeText={(value) => setFieldValue("email", value)}
            keyboardType="email-address"
          />

          <Input
            label={() => <Label title="Amount" />}
            caption={errors.amount ? errors.amount : ""}
            status={errors.amount ? "danger" : ""}
            onChangeText={(value) => {
              // const amount = formatToMoney(value);
              setFieldValue("amount", value);
            }}
            keyboardType="numeric"
            // value={values.amount as string}
          />

          <Input
            label={() => <Label title="Transaction PIN" />}
            caption={errors.transactionPin ? errors.transactionPin : ""}
            status={errors.transactionPin ? "danger" : ""}
            onChangeText={(value) => setFieldValue("transactionPin", value)}
            keyboardType="numeric"
          />

          <Input
            label={() => <Label title="Remark" />}
            caption={errors.remark ? errors.remark : ""}
            status={errors.remark ? "danger" : ""}
            onChangeText={(value) => setFieldValue("remark", value)}
          />

          <Input
            label={() => <Label title="PIN" />}
            caption={errors.PIN ? errors.PIN : ""}
            status={errors.PIN ? "danger" : ""}
            onChangeText={(value) => setFieldValue("PIN", value)}
            keyboardType="numeric"
            secureTextEntry
          />

          <Button
            onPress={() => handleSubmit()}
            style={{ marginBottom: 10, marginTop: 10 }}
          >
            {!current.matches("initiatingTransfer")
              ? "Proceed"
              : "Please wait..."}
          </Button>
        </Container>
      </KeyboardAwareScrollView>
      {current.matches({ transferRequestForm: "confirmation" }) && (
        <ConfirmTransferToMobile service={service} />
      )}

      <Loader visible={current.matches("initiatingTransfer")} />
    </Body>
  );
};
