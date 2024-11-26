// src/navigation/AppNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState, View } from "react-native";
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
import Animated from "react-native-reanimated";
import { ActivityIndicator } from "react-native";
import ForwarChatScreen from "src/screens/forwardChat/ForwardChatScreen";
import * as Notifications from "expo-notifications";
import { updateExpoPushToken } from "../services/api/authService";
import { registerForPushNotificationsAsync } from "../../utils/NotificationHandler";
import { useEffect, useRef, useState } from "react";
import { useUpdateChatList } from "src/context/updateChatListContext";
import { useAuthStore } from "src/services/storage/authStore";
import { useConversation } from "src/services/sockets/useConversation";
const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { handleFetchAgain } = useUpdateChatList();
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
        handleFetchAgain();
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
        // console.log(expoToken);
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
          console.log("App is in foreground, suppressing notification");
          return;
        } else {
          handleFetchAgain();
          console.log(
            "Notification received in background or killed",
            notification
          );
        }
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleFetchAgain();
      });
    return () => {
      appStateListener.remove();
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [appState]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        handleFetchAgain();
        console.log("updating");
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  // if (loadingLoggedUser) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Animated.Text
  //         style={{
  //           fontSize: 30,
  //           fontWeight: "bold",
  //           color: "#aa14f0",
  //         }}
  //       >
  //         Mymegamind
  //       </Animated.Text>
  //       <ActivityIndicator
  //         size="large"
  //         color="#0000ff"
  //         style={{ marginTop: 20 }}
  //       />
  //     </View>
  //   );
  // }

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
