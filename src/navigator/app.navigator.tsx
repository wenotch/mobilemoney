import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Login } from "../features/auth/screen/Login";
import { AppRoutes } from "./app.route";

export const Navigator = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName={AppRoutes.LOGIN}>
        <Stack.Screen name={AppRoutes.LOGIN} component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
