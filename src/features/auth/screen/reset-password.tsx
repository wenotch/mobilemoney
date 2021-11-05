import { useNavigation } from "@react-navigation/native";
import { Button } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { User } from "paygo";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useMutation } from "react-query";
import * as Yup from "yup";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { Logo } from "../../../components/logo";
import { ScreenTitle } from "../../../components/screen-title";
import { Colors } from "../../../constants";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { resetPasswordService } from "../fsm/password-reset-machine";
import { AuthService } from "../services/auth-service";

interface Props {}

type ResetPasswordFormType = Pick<User, "password"> & {
  confirmPassword: string;
  code: string;
};

const validationSchema = Yup.object().shape<ResetPasswordFormType>({
  password: Yup.string().required().min(5).label("Password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Confirm password does not match password"),
  code: Yup.string().required().min(4).label("Reset Token"),
});

export const ResetPassword: React.FC = ({}) => {
  const { navigate, goBack } = useNavigation();
  const [state, send] = useService(resetPasswordService);

  const [mutate, { error, status }] = useMutation(AuthService.resetPassword);

  const {
    errors,
    touched,
    values,
    handleSubmit,
    setFieldValue,
  } = useFormik<ResetPasswordFormType>({
    initialValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
    onSubmit(data) {
      send({ type: "RESET_PASSWORD", data });
    },
    validationSchema,
  });

  if (status === QueryStatus.Error) {
    send({ type: "ERROR", data: (error as AxiosError).message });
  }

  if (state.matches("login")) {
    goBack();
  }

  useEffect(() => {
    if (state.matches({ resetPassword: "submitting" })) {
      mutate(state.context.resetPasswordRequest);
    }

    if (state.matches({ resetPassword: "error" })) {
      showMessage({
        message: (error as AxiosError).message,
        type: "danger",
      });
    }

    if (state.matches({ resetPassword: "success" })) {
      navigate(AppRoutes.SIGN_IN);
    }
  }, [state.value]);

  return (
    <Body style={{ backgroundColor: Colors.darkBlue }}>
      <Container
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Logo />
          <ScreenTitle />
        </View>

        <KeyboardAvoidingView>
          <Input
            label="Password Reset Code"
            caption={errors.code && touched.code ? errors.code : ""}
            status={errors.code && touched.code ? "danger" : ""}
            onChangeText={(value) => setFieldValue("code", value)}
            value={values.code}
            style={{ ...globalStyles.input }}
            placeholder="Enter password reset code"
          />

          <Input
            label="New Password"
            caption={errors.password && touched.password ? errors.password : ""}
            status={errors.password && touched.password ? "danger" : ""}
            onChangeText={(value) => setFieldValue("password", value)}
            value={values.password}
            style={{ ...globalStyles.input }}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            caption={
              errors.confirmPassword && touched.confirmPassword
                ? errors.confirmPassword
                : ""
            }
            status={
              errors.confirmPassword && touched.confirmPassword ? "danger" : ""
            }
            onChangeText={(value) => setFieldValue("confirmPassword", value)}
            value={values.confirmPassword}
            style={{ ...globalStyles.input }}
            placeholder="Reenter new password"
          />

          <Button onPress={() => handleSubmit()} style={{ marginTop: 10 }}>
            Reset Password
          </Button>
        </KeyboardAvoidingView>

        <Button appearance="ghost" onPress={() => send({ type: "BACK" })}>
          {() => (
            <Text style={{ fontSize: 16, color: Colors.white }}>
              Back to Login
            </Text>
          )}
        </Button>
      </Container>
    </Body>
  );
};
