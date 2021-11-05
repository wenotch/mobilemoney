import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "@ui-kitten/components";
import { useMachine } from "@xstate/react";
import { useFormik } from "formik";
import { isUndefined } from "lodash";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import { transferApi, TransferWithinRequest } from "../../../api/transferApi";
import { userApi } from "../../../api/userApi";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { Loader } from "../../../components/loader";
import { Success } from "../../../components/success";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { ConfirmTransferWithin } from "../components/confirm-transfer-within";
import { transferWithinMachine } from "../machine/transferWithinService";

const validationSchema = Yup.object().shape<
  Partial<TransferWithinRequest & { phone: string }>
>({
  PIN: Yup.string().length(4).required().label("PIN"),
  amount: Yup.number().required().label("Amount"),
  remark: Yup.string().max(30).required().label("Remark"),
  phone: Yup.string().min(6).max(15).required().label("Mobile Phone Number"),
});

export const TransferWithin: React.FC = () => {
  const { navigate } = useNavigation();
  const [mutation] = useMutation((req: TransferWithinRequest) => {
    return transferApi.transferWithin(req);
  });

  const { errors, touched, setFieldValue, handleSubmit, values } = useFormik<
    TransferWithinRequest & { phone: string }
  >({
    onSubmit(values) {
      send({
        type: "PROCEED",
        data: values,
      });
    },
    initialValues: {
      phone: "",
      amount: "",
      remark: "",
      PIN: "",
    } as any,
    validationSchema,
  });

  const [current, send, service] = useMachine(
    transferWithinMachine.withConfig({
      services: {
        initiateTransfer(_context, event) {
          const data = event.type === "TRANSACTION_CONFIRMED" && event.data;
          return mutation(data as TransferWithinRequest);
        },
        confirmRecipientPhone(_, event) {
          return verifyPhoneQuery.refetch();
        },
      },
    })
  );

  const verifyPhoneQuery = useQuery(
    [`verify-phone-${values.phone}`, { phone: values.phone }],
    (key, { phone }) => {
      return userApi.confirmPhone(phone);
    },
    { enabled: false }
  );

  if (current.matches("success")) {
    return <Success />;
  }

  if (current.matches("complete")) {
    navigate(AppRoutes.HOME);
  }

  return (
    <Body>
      <AppTopNavigation childScreen title="Transfer To Paygo User" />
      <KeyboardAwareScrollView>
        <Container>
          <Text>Fill the form to send money to a Paygo wallet</Text>
          <Input
            label={() => (
              <View style={globalStyles.row}>
                <View style={globalStyles.col}>
                  <Label title="Phone Number" />
                </View>
                <View style={globalStyles.col}>
                  {!isUndefined(current.context.recipient) && (
                    <Text
                      style={{
                        color: "red",
                        fontSize: 15,
                        paddingTop: 10,
                        textAlign: "right",
                      }}
                    >
                      {current.context.recipient.name}
                    </Text>
                  )}
                </View>
              </View>
            )}
            caption={errors.phone && touched.phone ? errors.phone : ""}
            status={errors.phone && touched.phone ? "danger" : ""}
            onBlur={() =>
              send({
                type: "CONFIRM_RECIPIENT",
                phone: values.phone,
              })
            }
            onChangeText={(value) => {
              setFieldValue("phone", value);
            }}
            keyboardType="phone-pad"
          />

          <Input
            label={() => <Label title="Amount" />}
            caption={errors.amount && touched.amount ? errors.amount : ""}
            status={errors.amount && touched.amount ? "danger" : ""}
            onChangeText={(value) => setFieldValue("amount", value)}
            keyboardType="number-pad"
          />

          <Input
            label={() => <Label title="Remark" />}
            caption={errors.remark && touched.remark ? errors.remark : ""}
            status={errors.remark && touched.remark ? "danger" : ""}
            onChangeText={(value) => setFieldValue("remark", value)}
          />

          <Input
            label={() => <Label title="PIN" />}
            caption={errors.PIN && touched.PIN ? errors.PIN : ""}
            status={errors.PIN && touched.PIN ? "danger" : ""}
            onChangeText={(value) => setFieldValue("PIN", value)}
            keyboardType={"number-pad"}
            secureTextEntry
          />

          <Button onPress={() => handleSubmit()}>Proceed</Button>
        </Container>
      </KeyboardAwareScrollView>
      {current.matches({ transferForm: "confirmation" }) && (
        <ConfirmTransferWithin service={service} />
      )}
      <Loader visible={current.matches("initiatingTransfer")} />
    </Body>
  );
};
