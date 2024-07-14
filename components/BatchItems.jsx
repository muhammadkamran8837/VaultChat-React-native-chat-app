import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const BatchItems = ({ user, handleFunctionForDeletion }) => {
  return (
    <TouchableOpacity onPress={handleFunctionForDeletion}>
      <View
        style={{
          backgroundColor: "#3D737F",
          padding: 5,
          paddingHorizontal: 10,
          marginRight: 2,
          marginBottom: 2,
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          borderRadius: 20,
          gap: 2,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "white" }}>{user.name}</Text>
        <Ionicons name="close-outline" size={20} color={"white"} />
      </View>
    </TouchableOpacity>
  );
};

export default BatchItems;

const styles = StyleSheet.create({});
