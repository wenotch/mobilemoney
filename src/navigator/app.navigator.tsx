import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AppRoutes } from "./app.route";
import { AuthNavigator } from "./auth.navigator";
import { DrawerNavigator } from "./drawer.navigator";

export const Navigator = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name={AppRoutes.MAIN} component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
