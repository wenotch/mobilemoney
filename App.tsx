import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox } from "react-native";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryCache, ReactQueryCacheProvider, setConsole } from "react-query";
import { Colors } from "./src/constants";
import { SessionProvider } from "./src/lib/session/provider/session-proiver";
import { Navigator } from "./src/navigator/app.navigator";

// inspect();

export default function App() {
  const queryCache = new QueryCache({
    defaultConfig: { queries: { staleTime: 5000 } },
  });

  setConsole({
    log: console.log,
    warn: console.warn,
    error: console.warn,
  });

  return (
    <SafeAreaProvider>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <StatusBar style="auto" backgroundColor={Colors.seafoam} />
          <SessionProvider>
            <IconRegistry icons={EvaIconsPack} />
            <StatusBar style="dark" />
            <Navigator />
            <FlashMessage position="bottom" />
          </SessionProvider>
        </ApplicationProvider>
      </ReactQueryCacheProvider>
    </SafeAreaProvider>
  );
}
