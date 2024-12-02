import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Platform,
} from "react-native";
import { AuthProvider } from "./src/context/userContext";
import { SocketProvider } from "./src/context/useSocketContext";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { lightTheme, darkTheme } from "./src/misc/theme/theme";
export default function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(lightTheme);
  useEffect(() => {
    setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
  }, [colorScheme]);

  // Log to ensure theme is set properly
  console.log(colorScheme, "mode of phone"); // To see the phone's color scheme in the log

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <SocketProvider>
            <NavigationContainer theme={theme}>
              {/* <StatusBar
                barStyle={
                  colorScheme === "dark" ? "light-content" : "dark-content"
                }
                backgroundColor={colorScheme === "dark" ? "#000000" : "#FFFFFF"}
                translucent={false}
              /> */}
              <StatusBar
                barStyle={
                  colorScheme === "dark" ? "light-content" : "dark-content"
                } // Dynamic switching for all platforms
                translucent={true} // Ensures transparency
                backgroundColor="transparent" // Transparent background
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
