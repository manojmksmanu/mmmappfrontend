import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllChats } from "../../services/chatService";

export const fetchChats = async (
  setLoading: (loading: boolean) => void,
  setChats: (chats: any[]) => void,
  loggedUser: { _id: string } | null
) => {
  if (!loggedUser || !loggedUser._id) {
    console.error("User is not logged in or loggedUser._id is undefined");
    setChats([]);
    setLoading(false);
    return;
  }

  let parsedLocalChats: any[] = [];
  try {
    const localChats = await AsyncStorage.getItem("chats");
    parsedLocalChats = localChats ? JSON.parse(localChats) : [];
    setChats(parsedLocalChats);
    setLoading(true);
    const response = await getAllChats(loggedUser._id);
    let updatedChats = [...parsedLocalChats];
    for (const fetchedChat of response) {
      const existingChatIndex = updatedChats.findIndex(
        (localChat) => localChat._id === fetchedChat._id
      );

      if (existingChatIndex !== -1) {
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          ...fetchedChat,
        };
      } else {
        updatedChats.push(fetchedChat);
      }
    }
    if (JSON.stringify(updatedChats) !== JSON.stringify(parsedLocalChats)) {
      await AsyncStorage.setItem("chats", JSON.stringify(updatedChats));
      setChats(updatedChats);
    } else {
      console.log("No new chats to update");
    }
  } catch (error: any) {
    console.error("Failed to fetch chats:", error);
    if (
      error.message.includes("User not found") ||
      error.message.includes("invalid")
    ) {
      await AsyncStorage.removeItem("chats");
      setChats([]);
    }
  } finally {
    setLoading(false);
  }
};

// export const fetchChats = async (
//   setLoading: (loading: boolean) => void,
//   setChats: (chats: any[]) => void,
//   loggedUser: { _id: string } | null
// ) => {
//   if (!loggedUser || !loggedUser._id) {
//     console.error("User is not logged in or loggedUser._id is undefined");
//     setChats([]);
//     setLoading(false);
//     return;
//   }

//   let parsedLocalChats: any[] = [];
//   try {
//     // Retrieve and parse local chats
//     const localChats = await AsyncStorage.getItem("chats");
//     parsedLocalChats = localChats ? JSON.parse(localChats) : [];

//     console.log("Local Chats:", parsedLocalChats);

//     // Set chats from local storage if available
//     if (parsedLocalChats.length > 0) {
//       setChats(parsedLocalChats);
//     } else {
//       setLoading(true);
//     }

//     // Fetch latest chats from the server
//     const response = await getAllChats(loggedUser._id);
//     console.log(response, "fetched");

//     // Check for new chats by comparing the lengths and IDs of chats
//     const newChats = response.filter((fetchedChat: any) =>
//       !parsedLocalChats.find(
//         (localChat: any) => localChat._id === fetchedChat._id
//       )
//     );

//     console.log("New Chats:", newChats);

//     // Only update local storage and state if there are new chats
//     if (newChats.length > 0) {
//       const updatedChats = [...parsedLocalChats, ...newChats];
//       console.log("Updating local storage with:", updatedChats);
//       await AsyncStorage.setItem("chats", JSON.stringify(updatedChats));
//       setChats(updatedChats);
//     }
//   } catch (error: any) {
//     console.error("Failed to fetch chats:", error);
//     if (
//       error.message.includes("User not found") ||
//       error.message.includes("invalid")
//     ) {
//       await AsyncStorage.removeItem("chats");
//       setChats([]);
//     }
//   } finally {
//     setLoading(false); // Ensure loading is turned off in all cases
//   }
// };
