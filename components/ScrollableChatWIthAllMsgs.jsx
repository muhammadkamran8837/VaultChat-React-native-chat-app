import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Pressable,
  Linking,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useChat } from "../context/Context";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../ChatLogics/ChatLogics";
import UserAvatar from "react-native-user-avatar";
import { getSender } from "../ChatLogics/ChatLogics";
import { API_URL } from "@env";
import moment from "moment"; // Add moment.js for formatting the date and time
import FullScreenImageModal from "./FullScreenImageModal"; // Import the modal component

const ScrollableChatWIthAllMsgs = ({ messages }) => {
  const { user, selectedChat } = useChat();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");

  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        {messages &&
          messages.map((msg, index) => {
            const isOwnMessage = msg.sender._id === user._id;
            const isImage = msg.image;
            const isFile = msg.file;

            return (
              <View style={{ flexDirection: "row", gap: 1 }} key={msg._id}>
                {selectedChat.isGroupChat &&
                  (isSameSender(messages, msg, index, user._id) ||
                    isLastMessage(messages, msg, user._id)) && (
                    <UserAvatar
                      size={30}
                      name={getSender(user, selectedChat.users)}
                      style={{ marginRight: 10 }}
                    />
                  )}
                <View
                  style={{
                    backgroundColor: isImage
                      ? "transparent"
                      : isOwnMessage
                      ? "#609966"
                      : "white",
                    borderRadius: 13,
                    padding: 5,
                    paddingHorizontal: isImage ? 0 : 10,
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(
                      messages,
                      msg,
                      index,
                      user._id,
                      selectedChat.isGroupChat
                    ),
                    marginTop: isSameUser(messages, msg, index) ? 3 : 10,
                  }}
                >
                  {msg.content ? (
                    <Text
                      style={{
                        color: isOwnMessage ? "white" : "black",
                      }}
                    >
                      {msg.content}
                    </Text>
                  ) : null}
                  {isImage && (
                    <Pressable
                      onPress={() =>
                        openImageModal(
                          `${API_URL}/${msg.image.replace("\\", "/")}`
                        )
                      }
                    >
                      <Image
                        source={{
                          uri: `${API_URL}/${msg.image.replace("\\", "/")}`,
                        }}
                        style={{
                          width: 200,
                          height: 200,
                          borderRadius: 5,
                        }}
                      />
                    </Pressable>
                  )}
                  {isFile && (
                    <Pressable
                      onPress={() =>
                        Linking.openURL(
                          `${API_URL}/${msg.file.uri.replace("\\", "/")}`
                        )
                      }
                      style={{ marginTop: 5 }}
                    >
                      <Text
                        style={{
                          color: "blue",
                          textDecorationLine: "underline",
                        }}
                      >
                        {msg.file.name || "Download File"}
                      </Text>
                    </Pressable>
                  )}
                  <Text
                    style={{
                      color: isImage ? "gray" : isOwnMessage ? "white" : "gray",
                      fontSize: 10,
                      textAlign: "right",
                      marginTop: 5,
                    }}
                  >
                    {moment(msg.createdAt).format("LT")}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
      <FullScreenImageModal
        visible={modalVisible}
        imageUri={selectedImageUri}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default ScrollableChatWIthAllMsgs;

const styles = StyleSheet.create({});
