import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { useFormik } from "formik";
import { LoginCredentialType } from "paygo";
import React, { useContext } from "react";
import { Keyboard, KeyboardAvoidingView, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useMutation } from "react-query";
import * as Yup from "yup";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { Logo } from "../../../components/logo";
import { ScreenTitle } from "../../../components/screen-title";
import { Colors, ErrorCodes, flashMessageDuration } from "../../../constants";
import { SessionContext } from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { UserFormLabels } from "../config/form-labels";
import { resetPasswordService } from "../fsm/password-reset-machine";
import { AuthService } from "../services/auth-service";

const validationSchema = Yup.object().shape<LoginCredentialType>({
  email: Yup.string().required().email().label(UserFormLabels.email),
  password: Yup.string()
    .required()
    .min(4)
    .max(15)
    .label(UserFormLabels.password),
});

type LoginForm = LoginCredentialType;

interface Props {}

export const SignIn: React.FC<Props> = (_props) => {
  const { navigate } = useNavigation();
  const sessionContext = useContext(SessionContext);
  const [state, send] = useService(resetPasswordService);

  const [mutate, { status, error, reset, data: currentUser }] = useMutation(
    AuthService.authenticate
  );

  const { setFieldValue, handleSubmit, errors, touched, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    } as LoginForm,
    validationSchema,
    async onSubmit(credentials) {
      Keyboard.dismiss();
      await mutate(credentials);
    },
  });

  if (currentUser) {
    sessionContext!.setCurrentUser(currentUser);
  }

  if (status === QueryStatus.Error) {
    const { name, message } = error as Error;

    const nameStr = name && name.toString();

    if (nameStr === ErrorCodes.email_verification_pending) {
      navigate(AppRoutes.VERIFY_PHONE_NUMBER, {
        id: values.email,
      });
    }

    const errMsg =
      nameStr === ErrorCodes.failed_auth || nameStr === ErrorCodes.not_found
        ? "Invalid credential"
        : message;

    showMessage({
      message: errMsg,
      duration: flashMessageDuration,
      autoHide: false,
      type: "danger",
      textStyle: { textAlign: "center", fontSize: 15, fontWeight: "bold" },
    });

    reset();
  }

  if (status === QueryStatus.Success) {
    navigate(AppRoutes.MAIN);
  }

  if (state.matches({ requestResetToken: "idle" })) {
    navigate(AppRoutes.REQUEST_PASSWORD_RESET);
  }

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

        <KeyboardAvoidingView behavior="padding">
          <Input
            style={{ ...globalStyles.input }}
            label={UserFormLabels.email}
            placeholder="Enter your email"
            onChangeText={(value) => setFieldValue("email", value)}
            caption={errors.email && touched.email ? errors.email : ""}
            status={errors.email && touched.email ? "danger" : ""}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            style={{ ...globalStyles.input }}
            label={UserFormLabels.password}
            placeholder="Enter your password"
            onChangeText={(value) => setFieldValue("password", value)}
            caption={errors.password && touched.password ? errors.password : ""}
            status={errors.password && touched.password ? "danger" : ""}
            secureTextEntry
          />
          <Button
            size="large"
            style={{ ...globalStyles.formButton }}
            onPress={() => handleSubmit()}
          >
            {status === QueryStatus.Loading ? "Please wait..." : "LOGIN"}
          </Button>
        </KeyboardAvoidingView>

        <Button appearance="ghost" onPress={() => navigate(AppRoutes.SIGN_UP)}>
          {() => (
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              Don't have an account? Sign Up!
            </Text>
          )}
        </Button>
        <Button
          appearance="ghost"
          onPress={() => send("INITIATE_PASSWORD_RESET")}
        >
          {() => (
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              Forgotten password? Reset!
            </Text>
          )}
        </Button>
      </Container>
    </Body>
  );
};
