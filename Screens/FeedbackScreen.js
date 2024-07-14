import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useChat } from "../context/Context";

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState("");
  const { user } = useChat();

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
            Feedback
          </Text>
        </View>
      ),
      headerRight: () => <></>,
      title: "",
    });
  }, [navigation]);

  const submitFeedback = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://10.0.2.2:8000/api/feedback",
        { feedback },
        config
      );
      console.log("Feedback submitted successfully:", data);
      setFeedback("");
      Alert.alert("Success", "Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedback("");
      Alert.alert("Error", "Error submitting feedback");
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <View style={{ width: "100%" }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>Your feedback</Text>
            <TextInput
              style={{
                borderColor: "gray",
                borderWidth: 1,
                marginVertical: 10,
                paddingHorizontal: 10,
                height: 300,
              }}
              value={feedback}
              onChangeText={(text) => setFeedback(text)}
              placeholder="Enter your feedback"
            />
          </View>
          <Pressable
            style={{
              backgroundColor: "#3D737F",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 4,
              marginTop: 20,
            }}
            onPress={submitFeedback}
          >
            <Text
              style={{
                color: "white",
                flexDirection: "row",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              Submit
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({});
