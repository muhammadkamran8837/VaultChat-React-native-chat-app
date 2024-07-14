import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
        <Text> User Profile</Text>
        <TouchableOpacity onPress={onClose} style={{ marginLeft: 10 }}>
          <Text>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({});
