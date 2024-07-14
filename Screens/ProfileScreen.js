import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useChat } from "../context/Context";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useChat();
  const [name, setName] = useState(user.name);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Ionicons
              name="chevron-back-outline"
              size={25}
              style={{ color: "#3D737F" }}
            />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#3D737F" }}>
            Profile
          </Text>
        </View>
      ),
      headerRight: () => <></>,
      title: "",
    });
  }, [navigation]);

  const handleUpdateProfile = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        "http://10.0.2.2:8000/api/user/updateProfile",
        { name },
        config
      );

      setUser(response.data);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 20,
        justifyContent: "center",
        gap: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Image
          style={{
            width: 150,
            height: 150,
          }}
          source={require("../assets/profile.png")}
        />
      </View>

      <View style={{ gap: 5, marginLeft: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingVertical: 5,
          }}
        />
      </View>
      <View style={{ gap: 5, marginLeft: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Email</Text>
        <Text>{user.email}</Text>
      </View>
      <Pressable
        style={{
          backgroundColor: "#3D737F",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 4,
          marginTop: 20,
        }}
        onPress={handleUpdateProfile}
      >
        <Text
          style={{
            color: "white",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          Update Profile
        </Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
