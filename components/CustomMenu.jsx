import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useChat } from "../context/Context";
import UserAvatar from "react-native-user-avatar";

const CustomMenu = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const { user } = useChat();

  const LogoutFunc = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.replace("LoginSignUpScreen");
    } catch (error) {
      console.error("Error during logout:", error.message);
      Alert.alert("Error", "An error occurred during logout");
    }
  };

  const onProfilePress = () => {
    // Navigate to the "Profile" screen
    navigation.navigate("Profile");
    onClose(); // Close the menu after navigation
  };
  const onFeedbackPress = () => {
    // Navigate to the "Profile" screen
    navigation.navigate("Feedback");
    onClose(); // Close the menu after navigation
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: "70%",
                height: "100%",
                backgroundColor: "#F0F4F8",
              }}
            >
              {/* UPPER PORTION */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "30%",
                  backgroundColor: "#3D737F",
                  gap: 10,
                }}
              >
                <UserAvatar size={60} name={user.name} />
                {/* <Image
                  source={{
                    uri: "https://th.bing.com/th/id/R.8153491442f01e6d52171b497bd3fa9a?rik=TEe0q5jl%2bsxKVw&pid=ImgRaw&r=0",
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                /> */}
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {user.name}
                </Text>
                <Text style={{ color: "#fff" }}>{user.email}</Text>
              </View>

              {/* LOWER PORTION */}
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  gap: 20,
                  height: "60%",
                  backgroundColor: "#F0F4F8",
                }}
              >
                <TouchableOpacity
                  style={{
                    marginBottom: 20,
                    marginTop: 20,
                    flexDirection: "row",
                    gap: 10,
                  }}
                  onPress={onProfilePress}
                >
                  {/* <Ionicons name="images-outline" size={20} color="#2C3E50" /> */}

                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 20, flexDirection: "row", gap: 10 }}
                  onPress={onFeedbackPress}
                >
                  {/* <Ionicons name="cart-outline" size={20} color="#2C3E50" /> */}

                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Give Feedback
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginBottom: 20, flexDirection: "row", gap: 10 }}
                >
                  {/* <Ionicons name="trophy-outline" size={20} color="#2C3E50" /> */}

                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Settings
                  </Text>
                </TouchableOpacity>
              </View>

              {/* LAST PORTION */}
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  gap: 20,
                  backgroundColor: "#F0F4F8",
                }}
              >
                <TouchableOpacity
                  style={{ marginBottom: 20, flexDirection: "row", gap: 10 }}
                  onPress={LogoutFunc}
                >
                  {/* <Ionicons name="log-out-outline" size={20} color="#2C3E50" /> */}

                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomMenu;

const styles = StyleSheet.create({});
