import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat } from "../context/Context";
const SenderProfileOneOneChat = ({ visible, onClose }) => {
  const { selectedChat, user } = useChat();
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
        <Text>hiiii</Text>
        <TouchableOpacity onPress={onClose} style={{ marginLeft: 10 }}>
          <Text>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default SenderProfileOneOneChat;

const styles = StyleSheet.create({});
