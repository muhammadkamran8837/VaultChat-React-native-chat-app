import React from "react";
import { View, StyleSheet } from "react-native";

const HorizontalLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: "0.1%", // Height of the line
    backgroundColor: "#2C3E50", // Color of the line
    marginVertical: 10, // Vertical margin to add space around the line
  },
});

export default HorizontalLine;
