import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { User, UserRegistration } from "paygo";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Logo } from "../../../components/logo";
import { Colors } from "../../../constants";
import useFormWizard from "../../../lib/form-wizard/use-form-wizard";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { UserAccount } from "../component/user-account";
import { UserBVN } from "../component/user-bvn";
import { UserContact } from "../component/user-contact";
import { UserProfile } from "../component/user-profile";

interface Props {}

const registerUser = async (account: User) => {
  return AsyncStorage.setItem("users", JSON.stringify(account));
};

export const SignUp: React.FC<Props> = (props) => {
  const route = useRoute();
  const [mutate] = useMutation(registerUser);
  const { current, send } = useFormWizard<UserRegistration>({
    onSubmit: mutate,
  });

  useEffect(() => {
    send({ type: "INIT", maxSteps: 4 });
  }, []);

  const { navigate } = useNavigation();

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

        <>
          {current.context.currentStep === 0 && (
            <UserProfile send={send} current={current} />
          )}
          {current.context.currentStep === 1 && (
            <UserContact current={current} send={send} />
          )}
          {current.context.currentStep === 2 && (
            <UserAccount send={send} current={current} />
          )}
          {current.context.currentStep === 3 && (
            <UserBVN current={current} send={send} />
          )}
        </>

        <Button appearance="ghost" onPress={() => navigate(AppRoutes.SIGN_IN)}>
          {() => (
            <Text style={{ color: Colors.white }}>
              Already have an account? Sign In!
            </Text>
          )}
        </Button>
      </Container>
    </Body>
  );
};
