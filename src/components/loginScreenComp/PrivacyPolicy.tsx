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

const PrivacyPolicyText = `Privacy Policy (MegamindApp)
Last updated: December 09, 2024

This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.

We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.

Interpretation and Definitions
Interpretation
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.

Definitions
For the purposes of this Privacy Policy:

Account means a unique account created for You to access our Service or parts of our Service.
Affiliate means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority.
Application refers to MymegamindApp, the software program provided by the Company.
Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to MyMegaminds.
Country refers to Uttar Pradesh, India.
Device means any device that can access the Service, such as a computer, cellphone, or digital tablet.
Personal Data is any information that relates to an identified or identifiable individual.
Service refers to the Application.
Service Provider means any natural or legal person who processes data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service, or to assist the Company in analyzing how the Service is used.
Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
Collecting and Using Your Personal Data
Types of Data Collected
Personal Data
When signing up for Our Service, We collect the following personally identifiable information:

Email address
First name and last name
Phone number
This data is required solely for account creation and to enable access to the chat functionality.

Usage Data
Usage Data is collected automatically when using the Service and may include information such as:

Your Device's Internet Protocol address (IP address)
Browser type and version
Pages of our Service visited, time and date of visits, time spent on pages
Mobile device type, unique mobile ID, operating system, and browser type
Information Collected while Using the Application
While using Our Application, the following permissions are required only when specific features are used:

File Uploads in Chat: If You wish to send files or projects via the chat feature, We may request access to Your Device's file storage, including Your camera and photo library.
Optional Permissions: You may choose not to grant file permissions. However, without these permissions, file-sending functionality will not be available.
You can enable or disable access to these permissions at any time through Your Device settings.

Use of Your Personal Data
The Company may use Your Personal Data for the following purposes:

To provide and maintain our Service: Ensuring the Service operates smoothly for admin-to-student and admin-to-tutor communication.
To manage Your Account: Enabling Your registration and login.
To contact You: For communications such as account updates, service notifications, or support inquiries.
To enable chat functionality: Allowing Students to interact with Admins only, as per the Service design.
Retention of Your Personal Data
The Company will retain Your Personal Data only as long as necessary to provide the Service and comply with legal obligations.

Disclosure of Your Personal Data
We may share or disclose Your Personal Data:

With Service Providers: To maintain the functionality of the Service.
For legal compliance: To comply with applicable laws or respond to valid legal requests.
Security of Your Personal Data
We strive to protect Your data using commercially reasonable methods. However, no method of transmission or storage is completely secure.

Children's Privacy
The Service is not intended for children under 13. If We become aware of any unauthorized data collection, We will delete such information.

Changes to This Privacy Policy
We may update this Privacy Policy periodically. Changes will be communicated through the Service and take effect upon posting.

Contact Us
If You have any questions about this Privacy Policy, You can contact us:

By email: kumaracheles@gmail.com`;

const PrivacyPolicy = ({ visible, onAcceptPP, setShowPP, PPValue }) => {
  const handleOnCancel = () => {
    setShowPP(!visible);
    if (!PPValue) {
      showMessage({
        message: "Error",
        description: "You cannot continue without accepting Privacy Policy.",
        type: "danger",
      });
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
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
          <Text style={styles.eulaText}>{PrivacyPolicyText}</Text>
        </ScrollView>
        <Button
          title={PPValue ? "Reject" : "Accept"}
          onPress={async () => {
            await AsyncStorage.setItem("PPAccepted", "true");
            onAcceptPP();
          }}
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
  },
  eulaText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default PrivacyPolicy;
