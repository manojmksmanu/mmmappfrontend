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
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { loggeduser, updateExpoPushToken } from "./src/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  (async () => {
    try {
      const user = await loggeduser();
      console.log(user, "User data from loggeduser");
    } catch (error) {
      console.error("Error calling loggeduser:", error);
    }
  })();

  (async function registerForPushNotificationsAsync() {
    let expoToken;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === "granted") {
        expoToken = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "8321dc17-9024-42d4-938f-4fcee99d2911",
          })
        ).data;
        console.log("Expo Push Token:", expoToken);
        const data = await AsyncStorage.getItem("userInfo");
        const user = data ? JSON.parse(data) : null;
        await updateExpoPushToken(user, expoToken);
      }
    } else {
      alert("Push notifications are only supported on physical devices.");
    }
    return expoToken;
  })();

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
