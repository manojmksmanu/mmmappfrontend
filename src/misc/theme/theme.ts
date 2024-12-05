import { Theme } from "@react-navigation/native";

export const lightTheme: Theme = {
  dark: false,
  colors: {
    dark: false,
    background: "#e4f3f4",
    text: "#393939",
    primary: "#FFFFFF",
    secondary: "#F7F7F7",
    inputBgColor: "#DCDCDC",
    card: "#f8f8f8",
    border: "#e0e0e0",
    bottomNavPage: "#393939",
    bottomNavActivePage: "#059dc0",
    notification: "#ff4081",
  },
  images: {
    background: require("../../../assets/bg1.png"), // Replace with your image
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    dark: true,
    background: "#0b1115",
    text: "#FFFFFF",
    primary: "#1f262b",
    secondary: "#1f262b",
    inputBgColor: "#DCDCDC",
    card: "#121212",
    border: "#333333",
    bottomNavPage: "#FFF",
    bottomNavActivePage: "#059dc0",
    notification: "#ff4081",
  },
  images: {
    background: require("../../../assets/bg1.png"), // Replace with your image
  },
};
