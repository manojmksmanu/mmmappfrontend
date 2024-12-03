import { Platform } from "react-native";

// Function to return the base URL based on the environment
const LOCAL_IP = "192.168.1.3"; // Replace with your machine's local IP address

// export const BASE_URL =
//   Platform.OS === "android" && !__DEV__
//     ? "http://10.0.2.2:5000" // Emulator
//     : `http://${LOCAL_IP}:5000`; // Physical device or iOS emulator
export const BASE_URL = "https://mmmappbackend-yrsy.onrender.com";
