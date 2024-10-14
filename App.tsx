// App.tsx
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaView, StyleSheet } from "react-native";
import { AuthProvider } from "./src/context/userContext";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
            <FlashMessage position="top" />
          </NavigationContainer>
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
