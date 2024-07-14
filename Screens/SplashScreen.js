import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("LoginSignUpScreen");
    }, 4000);
  }, []);

  const fadeIn = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  };

  const zoomIn = {
    0: {
      scale: 0,
    },
    0.5: {
      scale: 1.3,
    },
    1: {
      scale: 1,
    },
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3D737F",
      }}
    >
      <Animatable.Text
        animation={fadeIn}
        style={{ color: "#E4D5C7", fontWeight: "bold", fontSize: 40 }}
        duration={3000}
      >
        VaultChat
      </Animatable.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
