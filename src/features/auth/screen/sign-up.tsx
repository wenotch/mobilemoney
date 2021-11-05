import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { User, UserRegistration } from "paygo";
import React, { useEffect, useState } from "react";
import { BackHandler, View, Keyboard } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Logo } from "../../../components/logo";
import { ScreenTitle } from "../../../components/screen-title";
import { Colors } from "../../../constants";
import { WizardEvent } from "../../../lib/form-wizard/types";
import useFormWizard from "../../../lib/form-wizard/use-form-wizard";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { UserAccount } from "../component/user-account";
import { UserBVN } from "../component/user-bvn";
import { UserProfile } from "../component/user-profile";
import { RegistrationService } from "../services/registration-service";

interface Props {}

const onDone = (event: WizardEvent) => {
  if (event.type === "done.invoke.submit") {
    return event.data as User;
  }

  return null;
};

export const SignUp: React.FC<Props> = (props) => {
  const [showLogo, setShowLogo] = useState<Boolean>(true);

  const { current, next, previous, submit, init } = useFormWizard<
    Partial<UserRegistration>
  >({
    onSubmit: RegistrationService.register,
    onDone,
  });

  useEffect(() => {
    init(3);

    Keyboard.addListener("keyboardDidShow", () => setShowLogo(false));
    Keyboard.addListener("keyboardDidHide", () => setShowLogo(true));
  }, []);

  const isFocused = useIsFocused();

  const { navigate } = useNavigation();

  useEffect(() => {
    const backHandler = () => {
      previous();

      return null;
    };

    BackHandler.addEventListener("hardwareBackPress", backHandler);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
  }, []);

  useEffect(() => {
    AsyncStorage.clear();
  }, [isFocused]);

  if (current.matches("success")) {
    navigate(AppRoutes.VERIFY_PHONE_NUMBER, {
      id: current.context.data?.email,
    });
  }

  if (current.matches("error")) {
    showMessage({
      message: current.context.message ?? "",
      type: "danger",
    });
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
        {showLogo && (
          <View style={{ alignItems: "center" }}>
            <Logo />
            <ScreenTitle />
          </View>
        )}

        <>
          {current.context.currentStep === 1 && (
            <UserProfile next={next} current={current} />
          )}
          {current.context.currentStep === 2 && (
            <UserAccount next={next} previous={previous} current={current} />
          )}
          {current.context.currentStep === 3 && (
            <UserBVN current={current} submit={submit} previous={previous} />
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
