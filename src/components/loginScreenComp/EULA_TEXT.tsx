// EULA.js
import React from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const EULA_TEXT = `End-User License Agreement (EULA)
Last Updated: December 09, 2024

Welcome to MyMegaminds! (MegamindsApp)

By downloading, installing, and using the MyMegaminds Application ("App"), provided by MyMegaminds, you agree to comply with and be bound by the following terms and conditions outlined in this End-User License Agreement ("EULA").

1. License Grant
MyMegaminds grants you a limited, non-exclusive, non-transferable license to use the MyMegaminds Application on your personal device solely for your personal or business use, in accordance with this EULA.

2. User Permissions and Data Handling
2.1 File Access Permissions
To enable the feature of sending files in chats, the app requires explicit permission to access the following:

Device Storage  
Camera  
Photo Library  

When you attempt to send files or projects, you will be prompted to grant the necessary permissions. Without these permissions, you will not be able to send any files or projects. However, users who do not require these functionalities can continue using other parts of the app without restrictions.

2.2 Purpose of Data Collection
Your Personal Data is collected solely to provide you with access to chat and file-sharing functionalities.  
This data may include your name, email address, phone number, device information, and any content you share or upload.  
Your data will only be stored temporarily and will be accessible as long as necessary to maintain core functionalities.

2.3 User Monitoring by Admin
An Administrator has the authority to observe user interactions and activity within the app.  
The Administrator reserves the right to remove users from the platform if their activity is deemed inappropriate or if they violate the terms outlined in this agreement.

3. Restrictions
You agree not to:

- Use the app for any illegal, harmful, or unauthorized purposes.
- Distribute, modify, or reverse engineer any part of the MyMegaminds app.
- Attempt to access unauthorized areas of the app's infrastructure or perform any action that disrupts or damages the app.

4. Ownership and Intellectual Property
The app, including its code, graphics, interface, and other content, is the property of MyMegaminds and is protected by copyright, trademark, and intellectual property laws.  
You do not gain any ownership rights to the app, its source code, or any of its proprietary components.

5. Termination of Agreement
This EULA will remain in effect until terminated by you or the company.  
MyMegaminds may terminate this agreement if you fail to comply with its terms. In such cases, your access to the app will be suspended or removed.

6. Limitation of Liability
To the fullest extent permitted by applicable law, MyMegaminds shall not be held liable for:

- Any loss or damage incurred by using the app  
- Unauthorized access, data loss, or service interruptions  
- Any reliance you place on the accuracy of content or interactions within the app

7. Changes to This EULA
MyMegaminds reserves the right to modify this EULA at any time.  
Changes will be communicated through an update or a notification on the platform.  
Continued use of the service after an update constitutes your agreement to the changes.

8. Contact Information
If you have questions or concerns about this End-User License Agreement, please contact us:

MyMegaminds  
Email: kumaracheles@gmail.com
Address:  India`;

const EULA = ({ showEULA, onAccept, setShowEULA, EULAValue }) => {
  const handleOnCancel = () => {
    setShowEULA(!showEULA);
    if(!EULAValue){
          showMessage({
            message: "Error",
            description: "You cannot continue without accepting the terms.",
            type: "danger",
          });
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={showEULA}>
      <View style={styles.modalView}>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            flexDirection: "row",
            zIndex: 1000,
          }}
        >
          <Button
            title={"cancel"}
            onPress={async () => {
              handleOnCancel();
            }}
            color={"#059dc0"}
          />
        </View>
        <ScrollView>
          <Text style={styles.eulaText}>{EULA_TEXT}</Text>
        </ScrollView>
        <Button
          title={EULAValue ? "Reject" : "Accept"}
          onPress={async () => {
            await AsyncStorage.setItem("eulaAccepted", "true");
            onAccept();
          }}
          color={"#059dc0"}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    position: "relative", // Ensure zIndex works
  },
  eulaText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  cancelButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EULA;
