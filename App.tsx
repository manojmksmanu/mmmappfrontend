import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  useColorScheme,
} from "react-native";
import { AuthProvider } from "./src/context/userContext";
import { SocketProvider } from "./src/context/useSocketContext";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { lightTheme, darkTheme } from "./src/misc/theme/theme";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(lightTheme);
  useEffect(() => {
    setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
  }, [colorScheme]);

  useEffect(() => {
    const prepareApp = async () => {
      // Do the work to prepare your app.
      // ...
    };

    const loadResources = async () => {
      // Load the resources and data that we need.
      // ...
    };

    const handleError = (error) => {
      console.error("Error loading app:", error);
    };

    const handleFinish = () => {
      SplashScreen.hideAsync();
    };

    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await prepareApp();
        await loadResources();
        handleFinish();
      } catch (error) {
        handleError(error);
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <SocketProvider>
            <NavigationContainer theme={theme}>
              <StatusBar
                barStyle={
                  colorScheme === "dark" ? "light-content" : "dark-content"
                }
                translucent={true}
                backgroundColor="transparent"
              />
              <AppNavigator />
              <FlashMessage position="top" />
            </NavigationContainer>
          </SocketProvider>
        </AuthProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
