import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter all fields");
        return;
      }
      const axiosInstance = axios.create({
        timeout: 5000, // 10 seconds timeout
      });
      setLoading(true);
      const response = await axiosInstance.post(
        "http://10.0.2.2:8000/api/user/login",
        {
          email,
          password,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        setEmail("");
        setPassword("");
        navigation.replace("Home");
      } else {
        Alert.alert("Error", "Failed to login");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error while login:", error.message);
      Alert.alert("Error", "An error occurred while login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <View>
        <TextInput
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Enter your email"
        />
      </View>
      <View>
        <TextInput
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Enter password"
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          onPress={handleLogin}
          color={"#3D737F"}
          title={loading ? "Logging in..." : "Login"}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
