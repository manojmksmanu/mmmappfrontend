// src/theme.d.ts
import { Theme as NavigationTheme } from "@react-navigation/native";

declare module "@react-navigation/native" {
  export interface Theme extends NavigationTheme {
    dark: boolean;
    colors: {
      dark: boolean;
      background: string;
      text: string;
      primary: string;
      secondary: string;
      inputBgColor: string;
      card: string;
      border: string;
      bottomNavPage: string;
      bottomNavActivePage:string;
      notification: string;
    };
    images: {
      background: any; // You can replace `any` with a more specific type like `ImageSourcePropType` from React Native if you're using images
    };
  }
}
