import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { User } from "paygo";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, View } from "react-native";
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

type RequestPasswordResetTokenType = Pick<User, "email">;

const validationSchema = Yup.object().shape<RequestPasswordResetTokenType>({
  email: Yup.string().required().email().label("Email address"),
});

export const PasswordResetRequest: React.FC<Props> = ({}) => {
  const { errors, values, touched, setFieldValue, handleSubmit } = useFormik({
    initialValues: {} as RequestPasswordResetTokenType,
    validationSchema,
    onSubmit(data) {
      send({ type: "SUBMIT", data });
    },
  });

  const { goBack, navigate } = useNavigation();
  const [state, send] = useService(resetPasswordService);

  const [mutate, { status, error }] = useMutation(
    AuthService.requestPasswordResetToken
  );

  if (status === QueryStatus.Error) {
    send({ type: "ERROR", data: (error as AxiosError).message });
  }

  if (state.matches("login")) {
    goBack();
  }

  useEffect(() => {
    if (state.matches({ requestResetToken: "submitting" })) {
      mutate(state.context.data)
        .then(() => {
          send({ type: "SUCCESS" });
        })
        .catch((err: AxiosError) => {
          send({ type: "ERROR", data: err.message });
        });
    }

    if (state.matches({ requestResetToken: "error" })) {
      showMessage({
        message: error ? (error as AxiosError).message : "",
        type: "danger",
      });
    }

    if (state.matches({ requestResetToken: "success" })) {
      navigate(AppRoutes.RESET_PASSWORD);
    }
  }, [state.value]);

  return (
    <Body style={{ ...globalStyles.blueBackground }}>
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
          <Text style={{ color: Colors.white, textAlign: "center" }}>
            Enter your email address to get password reset token.
          </Text>
          <Input
            onChangeText={(value) => setFieldValue("email", value)}
            value={values.email}
            caption={errors.email && touched.email ? errors.email : ""}
            status={errors.email && touched.email ? "danger" : ""}
            autoCapitalize="none"
          />
          <Button style={{ marginTop: 10 }} onPress={() => handleSubmit()}>
            {state.matches({ requestResetToken: "submitting" })
              ? "Please wait..."
              : "Request Reset Token"}
          </Button>

          <Button
            appearance="ghost"
            onPress={() => {
              send({ type: "BACK" });
            }}
            style={{ marginTop: 50 }}
          >
            {() => (
              <Text style={{ color: Colors.white, fontSize: 16 }}>
                Back to Login
              </Text>
            )}
          </Button>
        </KeyboardAvoidingView>
      </Container>
    </Body>
  );
};
