import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { Navigator } from "./src/navigator/app.navigator";

export default function App() {
  const queryCache = new QueryCache();

  return (
    <SafeAreaProvider>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <IconRegistry icons={EvaIconsPack} />
          <StatusBar style="light" />
          <Navigator />
        </ApplicationProvider>
      </ReactQueryCacheProvider>
    </SafeAreaProvider>
  );
}
