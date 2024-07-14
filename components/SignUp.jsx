import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert("Error", "Please enter all fields");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      const response = await axios.post("http://10.0.2.2:8000/api/user", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert("Success", "User registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigation.navigate("LoginSignUpScreen");
      } else {
        Alert.alert("Error", "Failed to create user");
      }

      setName("");
      setEmail("");
      setConfirmPassword("");
      setPassword("");
    } catch (error) {
      console.error("Error registering user:", error.message);
      Alert.alert("Error", "An error occurred while registering user");
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
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter your Name"
        />
      </View>
      <View>
        <TextInput
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Enter Email"
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
      <View>
        <TextInput
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          placeholder="Confirm password"
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button onPress={handleSignUp} color={"#3D737F"} title="Sign Up" />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
