import React from "react";
import { Modal, Image, View, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const FullScreenImageModal = ({ visible, imageUri, onClose }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ alignSelf: "flex-end", marginTop: 5 }}
        >
          <Ionicons name="close" size={30} color="white" />
        </Pressable>
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default FullScreenImageModal;
