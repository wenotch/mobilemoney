import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { VerifyTokenRequest } from "paygo";
import React from "react";
import { View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useMutation } from "react-query";
import * as Yup from "yup";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { Logo } from "../../../components/logo";
import { ScreenTitle } from "../../../components/screen-title";
import { Colors, flashMessageDuration } from "../../../constants";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { RegistrationService } from "../services/registration-service";

const validationSchema = Yup.object().shape({
  code: Yup.string().min(4).max(6).required().label("OTP token"),
});

interface Props {}

export const VerifyPhoneNumber: React.FC<Props> = ({}) => {
  const { params } = useRoute();
  const [mutate, { status, error, reset }] = useMutation(
    RegistrationService.verifyToken
  );

  const {
    errors,
    setFieldValue,
    handleSubmit,
    touched,
    values,
    initialValues,
  } = useFormik({
    initialValues: {
      id: (params! as { email: string }).email,
    } as VerifyTokenRequest,
    onSubmit: (values: VerifyTokenRequest) => {
      values.id =
        (params! as { id: string }).id || (params! as { email: string }).email;
      mutate(values);
    },
    validationSchema,
  });

  const { navigate } = useNavigation();

  if (status === QueryStatus.Error) {
    const message = (error as AxiosError).message;
    showMessage({
      message,
      autoHide: true,
      duration: flashMessageDuration,
      type: "danger",
    });

    reset();
  }

  if (status === QueryStatus.Success) {
    showMessage({
      message: "You have successfully activated your account",
      autoHide: true,
      duration: flashMessageDuration,
      type: "success",
    });

    navigate(AppRoutes.SIGN_IN);
  }

  return (
    <Body style={{ ...globalStyles.blueBackground }}>
      <Container
        style={{
          flex: 1,
          justifyContent: "space-around",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Logo />
          <ScreenTitle />
        </View>

        <View>
          <Text style={{ textAlign: "center", color: Colors.white }}>
            An OTP token has been sent to your email.
          </Text>
          <Input
            style={globalStyles.input}
            placeholder="Enter OTP"
            caption={errors.code && touched.code ? errors.code : ""}
            status={errors.code && touched.code ? "danger" : ""}
            onChangeText={(value) => setFieldValue("code", value)}
            keyboardType="number-pad"
          />
          <Button style={{ marginTop: 10 }} onPress={() => handleSubmit()}>
            {status === QueryStatus.Loading ? "Verifying..." : "Verify"}
          </Button>
        </View>
      </Container>
    </Body>
  );
};
