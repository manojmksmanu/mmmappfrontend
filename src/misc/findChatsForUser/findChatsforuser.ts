import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllChats } from "../../services/api/chatService";

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
//     const localChats = await AsyncStorage.getItem("chats");
//     parsedLocalChats = localChats ? JSON.parse(localChats) : [];
//     setChats(parsedLocalChats);
//     console.log(parsedLocalChats[0]);
//     setLoading(true);
//     const response = await getAllChats(loggedUser._id);
//     console.log(response[0].latestMessage, "fetch");
//     let updatedChats = [...parsedLocalChats];
//     for (const fetchedChat of response) {
//       const existingChatIndex = updatedChats.findIndex(
//         (localChat) => localChat._id === fetchedChat._id
//       );

//       if (existingChatIndex !== -1) {
//         updatedChats[existingChatIndex] = {
//           ...updatedChats[existingChatIndex],
//           ...fetchedChat,
//         };
//       } else {
//         updatedChats.push(fetchedChat);
//       }
//     }
//     if (JSON.stringify(updatedChats) !== JSON.stringify(parsedLocalChats)) {
//       await AsyncStorage.setItem("chats", JSON.stringify(updatedChats));
//       setChats(updatedChats);
//     } else {
//       console.log("No new chats to update");
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
//     setLoading(false);
//   }
// };

export const fetchChats = async (
  setLoading: (loading: boolean) => void,
  setChats: (chats: any[]) => void,
  loggedUser: { _id: string } | null
) => {
  if (!loggedUser || !loggedUser?._id) {
    console.error("User is not logged in or loggedUser._id is undefined");
    setChats([]);
    setLoading(false);
    return;
  }

  try {
    // Retrieve local chats
    const localChats = await AsyncStorage.getItem("chats");
    const parsedLocalChats = localChats ? JSON.parse(localChats) : [];

    if (parsedLocalChats.length > 0) {
      setChats(parsedLocalChats); // Set from local storage
    }

    // Fetch chats from API
    const response = await getAllChats(loggedUser._id);

    if (parsedLocalChats.length === 0) {
      console.log("setting skfjksdfkshdfkhskdhfsjkldfjksdhjklhsdjkfh");
      setLoading(true);
      setChats(response); // Set from API if no local chats
      await AsyncStorage.setItem("chats", JSON.stringify(response));
    } else {
      setLoading(true);
      // Update AsyncStorage with new chats
      const newChats = response.filter(
        (fetchedChat) =>
          !parsedLocalChats.some(
            (localChat) => localChat._id === fetchedChat._id
          )
      );
      if (newChats.length > 0) {
        const updatedChats = [...parsedLocalChats, ...newChats];
        setChats(updatedChats); // Update state
        await AsyncStorage.setItem("chats", JSON.stringify(updatedChats));
      }
    }
  } catch (error) {
    console.error("Failed to fetch chats:", error);
  } finally {
    setLoading(false);
  }
};
