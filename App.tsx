// App.tsx
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaView, StyleSheet } from "react-native";
import { AuthProvider } from "./src/context/userContext";
import { MessageProvider } from "./src/context/messageContext";
import { NavigationContainer } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <MessageProvider>
            <NavigationContainer>
              <AppNavigator />
              <FlashMessage position="top" />
            </NavigationContainer>
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

// import { useState, useEffect, useRef } from "react";
// import { Text, View, Button, Platform } from "react-native";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
//     []
//   );
//   const [notification, setNotification] = useState<
//     Notifications.Notification | undefined
//   >(undefined);
//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(
//       (token) => token && setExpoPushToken(token)
//     );

//     if (Platform.OS === "android") {
//       Notifications.getNotificationChannelsAsync().then((value) =>
//         setChannels(value ?? [])
//       );
//     }
//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log('hello message is recived')
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     return () => {
//       notificationListener.current &&
//         Notifications.removeNotificationSubscription(
//           notificationListener.current
//         );
//       responseListener.current &&
//         Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "space-around",
//       }}
//     >
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <Text>{`Channels: ${JSON.stringify(
//         channels.map((c) => c.id),
//         null,
//         2
//       )}`}</Text>
//       <View style={{ alignItems: "center", justifyContent: "center" }}>
//         <Text>
//           Title: {notification && notification.request.content.title}{" "}
//         </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>
//           Data:{" "}
//           {notification && JSON.stringify(notification.request.content.data)}
//         </Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "goes here", test: { test1: "more data" } },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     // EAS projectId is used here.
//     try {
//       const projectId =
//         Constants?.expoConfig?.extra?.eas?.projectId ??
//         Constants?.easConfig?.projectId;
//       if (!projectId) {
//         throw new Error("Project ID not found");
//       }
//       token = (
//         await Notifications.getExpoPushTokenAsync({
//           projectId,
//         })
//       ).data;
//       console.log(token);
//     } catch (e) {
//       token = `${e}`;
//     }
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   return token;
// }
