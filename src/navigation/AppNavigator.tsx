// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login/LoginScree";
import SignUpScreen from "../screens/signUp/SIgnUpScreen";
import ForgotPasswordScreen from "../screens/forgotPassword/ForgotPassword";
import ChatListScreen from "../screens/chatList/ChatListScreen";

import ChatWindowScreen from "../screens/chatWindow/ChatWindowScreen";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="ChatWindow2" component={ChatWindowScreen} />
      </Stack.Navigator>
    
  );
};

export default AppNavigator;
