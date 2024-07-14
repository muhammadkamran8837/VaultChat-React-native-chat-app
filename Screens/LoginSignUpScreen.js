import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { Link } from "@react-navigation/native";

const LoginSignUpScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <KeyboardAvoidingView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            gap: 10,
            width: 300,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            {isLogin ? "Hello!\nWelcome Back. Please Login." : "Sign Up"}
          </Text>
          {isLogin ? <Login /> : <SignUp />}
          <Text>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Text
              style={{ color: "#3D737F", marginRight: 1 }}
              onPress={toggleForm}
            >
              {isLogin ? "Create an account" : "Login"}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginSignUpScreen;

const styles = StyleSheet.create({});
