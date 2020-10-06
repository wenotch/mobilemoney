import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { VerifyPhoneNumber } from "../features/auth/screen/phone-number-verification";
import { SignIn } from "../features/auth/screen/sign-in";
import { SignUp } from "../features/auth/screen/sign-up";
import { AppRoutes } from "./app.route";

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator
    headerMode="none"
    initialRouteName={AppRoutes.VERIFY_PHONE_NUMBER}
  >
    <Stack.Screen name={AppRoutes.SIGN_IN} component={SignIn} />
    <Stack.Screen name={AppRoutes.SIGN_UP} component={SignUp} />
    <Stack.Screen
      name={AppRoutes.VERIFY_PHONE_NUMBER}
      component={VerifyPhoneNumber}
    />
  </Stack.Navigator>
);
