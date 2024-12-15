// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { Platform } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export async function sendPushNotification(expoPushToken: string) {
//   const message = {
//     to: expoPushToken,
//     sound: "default",
//     title: "Original Title",
//     body: "And here is the body!",
//     data: { someData: "goes here" },
//   };

//   await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-encoding": "gzip, deflate",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
// }

// export function handleRegistrationError(errorMessage: string) {
//   throw new Error(errorMessage);
// }

// export async function registerForPushNotificationsAsync() {
//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//       sound: "default",
//       enableVibrate: true,
//       showBadge: true,
//     });
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== "granted") {
//     handleRegistrationError(
//       "Permission not granted to get push token for push notification!"
//     );
//     return;
//   }
//   const projectId =
//     Constants?.expoConfig?.extra?.eas?.projectId ??
//     Constants?.easConfig?.projectId;
//   if (!projectId) {
//     handleRegistrationError("Project ID not found");
//   }
//   try {
//     const pushTokenString = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId,
//       })
//     ).data;
//     return pushTokenString;
//   } catch (e: unknown) {
//     handleRegistrationError(`${e}`);
//   }
// }
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export function handleRegistrationError(errorMessage: string) {
  throw new Error(errorMessage);
}

export async function getOrUpdateExpoToken() {
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.error("Project ID not found");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.error("Push notification permissions not granted!");
    return null;
  }

  try {
    const storedToken = await AsyncStorage.getItem("expoPushToken");
    const newToken = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;

    if (storedToken !== newToken) {
      await AsyncStorage.setItem("expoPushToken", newToken);
      return newToken;
    } else {
      return storedToken;
    }
  } catch (error) {
    return null;
  }
}

export async function registerForPushNotificationsAsync() {
  // Set up notification channel for Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
      enableVibrate: true,
      showBadge: true,
    });
  }

  try {
    const expoPushToken = await getOrUpdateExpoToken();
    if (!expoPushToken) {
      handleRegistrationError("Unable to retrieve or update Expo Push Token!");
    }
    return expoPushToken;
  } catch (error) {
    handleRegistrationError(`Error during registration: ${error}`);
  }
}
