import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useFormik } from "formik";
import { LoginCredentialType } from "paygo";
import React, { useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { api } from "../../../api";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { Logo } from "../../../components/logo";
import { Colors } from "../../../constants";
import useFormWizard from "../../../lib/form-wizard/use-form-wizard";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { UserFormLabels } from "../config/form-labels";

const validationSchema = Yup.object().shape<LoginCredentialType>({
  phone: Yup.string().required().min(5).max(15).label(UserFormLabels.phone),
  password: Yup.string()
    .required()
    .min(5)
    .max(15)
    .label(UserFormLabels.password),
});

type LoginForm = LoginCredentialType;

interface Props {}

export const SignIn: React.FC<Props> = (_props) => {
  const route = useRoute();
  const { navigate } = useNavigation();

  const [mutate] = useMutation(api.auth.login);
  const { send, current } = useFormWizard({
    onSubmit: mutate,
  });

  useEffect(() => {
    send("INIT", { maxSteps: 1 });
  }, []);

  const { setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      phone: "",
      password: "",
    } as LoginForm,
    validationSchema,
    async onSubmit(credentials) {
      send("SUBMIT", { data: credentials });
    },
  });

  return (
    <Body style={{ ...globalStyles.blueBackground }}>
      <Container
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Logo />
        <Text category="h1" style={{ color: Colors.white }}>
          {route.name}
        </Text>
        <KeyboardAvoidingView behavior="padding">
          <Input
            style={{ ...globalStyles.input }}
            label={UserFormLabels.phone}
            placeholder="Enter your phone number"
            onChangeText={(value) => setFieldValue("phone", value)}
            caption={errors.phone && touched.phone ? errors.phone : ""}
            status={errors.phone && touched.phone ? "danger" : ""}
            keyboardType="number-pad"
          />
          <Input
            style={{ ...globalStyles.input }}
            label={UserFormLabels.password}
            placeholder="Enter your password"
            onChangeText={(value) => setFieldValue("password", value)}
            caption={errors.password && touched.password ? errors.password : ""}
            status={errors.password && touched.password ? "danger" : ""}
          />
          <Button
            size="large"
            style={{ ...globalStyles.formButton }}
            onPress={() => handleSubmit()}
            disabled={current.matches("pending")}
          >
            LOGIN
          </Button>
        </KeyboardAvoidingView>

        <Button appearance="ghost" onPress={() => navigate(AppRoutes.SIGN_UP)}>
          {() => (
            <Text style={{ color: Colors.white, fontSize: 16 }}>
              Don't have an account? Sign Up!
            </Text>
          )}
        </Button>
        <Button appearance="ghost">
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
