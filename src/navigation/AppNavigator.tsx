// src/navigation/AppNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import LoginScreen from "../screens/login/LoginScree";
import SignUpScreen from "../screens/signUp/SIgnUpScreen";
import ForgotPasswordScreen from "../screens/forgotPassword/ForgotPassword";
import ChatListScreen from "../screens/chatList/ChatListScreen";
import ChatWindowScreen from "../screens/chatWindow/ChatWindowScreen";
import ProfileScreen from "src/screens/profile/ProfileScreen";
import GroupCreateScreen from "src/screens/groupScreens/GroupCreateScreen";
import GroupInfoScreen from "src/screens/groupScreens/GroupInfoScreen";
import AddUserToGroupScreen from "src/screens/groupScreens/AddUserToGroupScreen";
import DeleteAccountScreen from "src/screens/deleteAccount/DeleteAccountScreen";
import { useAuth } from "src/context/userContext";
import Animated from "react-native-reanimated";
import { ActivityIndicator } from "react-native";
import ForwarChatScreen from "src/screens/forwardChat/ForwardChatScreen";
const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { loggedUser, loadingLoggedUser } = useAuth();
  console.log(loadingLoggedUser);
  if (loadingLoggedUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#aa14f0",
          }}
        >
          Mymegamind
        </Animated.Text>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

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
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
          <Stack.Screen name="ForwardChatScreen" component={ForwarChatScreen} />
          <Stack.Screen name="ChatWindow2" component={ChatWindowScreen} />
          <Stack.Screen name="GroupCreate" component={GroupCreateScreen} />
          <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
          <Stack.Screen
            name="AddUserToGroup"
            component={AddUserToGroupScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AppNavigator;
