// src/navigation/AppNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState } from "react-native";
import LoginScreen from "../screens/login/LoginScreen";
import SignUpScreen from "../screens/signUp/SIgnUpScreen";
import ForgotPasswordScreen from "../screens/forgotPassword/ForgotPassword";
import ChatListScreen from "../screens/chatList/ChatListScreen";
import ChatWindowScreen from "../screens/chatWindow/ChatWindowScreen";
import ProfileScreen from "src/screens/profile/ProfileScreen";
import GroupCreateScreen from "src/screens/groupScreens/GroupCreateScreen";
import GroupInfoScreen from "src/screens/groupScreens/GroupInfoScreen";
import AddUserToGroupScreen from "src/screens/groupScreens/AddUserToGroupScreen";
import DeleteAccountScreen from "src/screens/deleteAccount/DeleteAccountScreen";
import ForwarChatScreen from "src/screens/forwardChat/ForwardChatScreen";
import * as Notifications from "expo-notifications";
import { updateExpoPushToken } from "../services/api/authService";
import { registerForPushNotificationsAsync } from "../../utils/NotificationHandler";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "src/services/storage/authStore";
import { useConversation } from "src/services/sockets/useConversation";
import MyProject from "src/screens/projectScreens/MyProject";
import CreateProject from "src/screens/projectScreens/CreateProject";
const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { loggedUser, token } = useAuthStore();

  

  useConversation();
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      if (AppState.currentState === "active") {
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      } else {
        return {
          shouldShowAlert: appState !== "active",
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      }
    },
  });

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (expoToken: any) => {
        const user = loggedUser || null;

        await updateExpoPushToken(user, expoToken, token);
        console.log(expoToken);
      })
      .catch((error: any) => console.log(error, "token error"));
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        setAppState(nextAppState);
      }
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (appState === "active") {
          return;
        } else {
        }
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});
    return () => {
      appStateListener.remove();
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [appState, loggedUser]);

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      {!loggedUser ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ForgotPassowrd"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ChatList"
            component={ChatListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyProject"
            component={MyProject}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateProject"
            component={CreateProject}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeleteAccount"
            component={DeleteAccountScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForwardChatScreen"
            component={ForwarChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatWindow"
            component={ChatWindowScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GroupCreate"
            component={GroupCreateScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GroupInfo"
            component={GroupInfoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddUserToGroup"
            component={AddUserToGroupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppNavigator;
