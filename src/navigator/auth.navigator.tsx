import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { PasswordResetRequest } from "../features/auth/screen/password-reset-request";
import { VerifyPhoneNumber } from "../features/auth/screen/phone-number-verification";
import { ResetPassword } from "../features/auth/screen/reset-password";
import { SignIn } from "../features/auth/screen/sign-in";
import { SignUp } from "../features/auth/screen/sign-up";
import { AppRoutes } from "./app.route";

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator headerMode="none" initialRouteName={AppRoutes.SIGN_IN}>
    <Stack.Screen name={AppRoutes.SIGN_IN} component={SignIn} />
    <Stack.Screen name={AppRoutes.SIGN_UP} component={SignUp} />
    <Stack.Screen
      name={AppRoutes.VERIFY_PHONE_NUMBER}
      component={VerifyPhoneNumber}
    />
    <Stack.Screen
      name={AppRoutes.REQUEST_PASSWORD_RESET}
      component={PasswordResetRequest}
    />
    <Stack.Screen name={AppRoutes.RESET_PASSWORD} component={ResetPassword} />
  </Stack.Navigator>
);
