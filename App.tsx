// App.tsx
import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaView, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "./src/context/userContext";
import { MessageProvider } from "./src/context/messageContext";
import { ChatListUpdateProvider } from "./src/context/updateChatListContext";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <MessageProvider>
            <ChatListUpdateProvider>
              <NavigationContainer>
                <AppNavigator />
                <FlashMessage position="top" />
              </NavigationContainer>
            </ChatListUpdateProvider>
          </MessageProvider>
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
