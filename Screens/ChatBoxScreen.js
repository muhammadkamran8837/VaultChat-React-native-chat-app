import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useChat } from "../context/Context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import UserAvatar from "react-native-user-avatar";
import { getSender } from "../ChatLogics/ChatLogics";
import ProfileModal from "../components/ProfileModal";
import ScrollableChatWIthAllMsgs from "../components/ScrollableChatWIthAllMsgs";
import axios from "axios";
import io from "socket.io-client";
import { AES_SECRET_KEY, API_URL } from "@env";
import CryptoJS from "crypto-js";
import SenderProfileOneOneChat from "../components/SenderProfileOneOneChat";
import UpdateGChatModal from "../components/UpdateGChatModal";

const ChatBoxScreen = () => {
  const {
    selectedChat,
    user,
    setselectedChat,
    fetchAgain,
    setFetchAgain,
    notifications,
    setNotifications,
  } = useChat();
  const navigation = useNavigation();
  const [isUpdateGChatModal, setIsUpdateGChatModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState();
  const [file, setFile] = useState(null);
  const [isSenderProfileVisible, setIsSenderProfileVisible] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false); // Added this state

  // SOCKET.IO CONNECTION
  useEffect(() => {
    socket = io(`${API_URL}/`);
    socket.on("connection", () => setSocketConnected(true));

    socket.emit("setup", user);
  }, []);

  //.................ENCRYPTION DECRYPTION FUNCTIONS.................................
  const encryptMessage = (message, secretKey) => {
    const encryptedMessage = CryptoJS.AES.encrypt(
      JSON.stringify(message),
      secretKey
    ).toString();
    return encryptedMessage;
  };

  const decryptMessage = (encryptedMessage, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    const decryptedMessage = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedMessage;
  };
  //.................ENCRYPTION DECRYPTION FUNCTIONS ENDS.................................

  //............................HEADER STARTS.........................
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
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

              <UserAvatar
                size={30}
                name={
                  !selectedChat.isGroupChat
                    ? getSender(user, selectedChat.users)
                    : selectedChat.chatName
                }
                style={{ marginRight: 5 }}
              />
              <Text
                style={{ fontWeight: "bold", fontSize: 20, maxWidth: "85%" }}
              >
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName}
              </Text>
            </View>
            <View>
              {!selectedChat.isGroupChat && (
                <Text
                  style={{
                    color: otherUserOnline ? "green" : "red",
                    marginLeft: 70,
                  }}
                >
                  Currently {otherUserOnline ? "online" : "ofline"}
                </Text>
              )}
            </View>
          </View>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedChat.isGroupChat ? (
            <Pressable
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: "#686D76",
                borderRadius: 5,
              }}
              onPress={() => setIsUpdateGChatModal(true)}
            >
              <Text style={{ color: "white" }}>Edit Group</Text>
            </Pressable>
          ) : (
            <Pressable
              style={{}}
              onPress={() => setIsSenderProfileVisible(true)}
            >
              <Ionicons name="ellipsis-vertical-outline" size={20} />
            </Pressable>
          )}
        </View>
      ),
      title: "",
    });
  }, [navigation]);

  //......................HEADER ENDS.............................

  //...................USER ACTIVE STATUS.........................
  useEffect(() => {
    if (selectedChat && !selectedChat.isGroupChat) {
      const otherUserId = selectedChat.users.find(
        (u) => u._id !== user._id
      )._id;

      const handleUserOnline = (userId) => {
        if (userId === otherUserId) {
          setOtherUserOnline(true);
        }
      };

      const handleUserOffline = (userId) => {
        if (userId === otherUserId) {
          setOtherUserOnline(false);
        }
      };

      socket.on("user online", handleUserOnline);
      socket.on("user offline", handleUserOffline);

      return () => {
        socket.off("user online", handleUserOnline);
        socket.off("user offline", handleUserOffline);
      };
    }
  }, [selectedChat]);

  //...................USER ACTIVE STATUS ENDS.........................

  //PICK FILE FUNCTION
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      console.log("pickFile result:", res);
      if (!res.canceled) {
        setFile(res.assets[0]);
      } else {
        console.log("User cancelled the picker");
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  //SEND MESSAGE FUNCTION
  const sendMessage = async () => {
    try {
      const formData = new FormData();
      if (newMessage) {
        formData.append("content", newMessage);
      }
      formData.append("chatId", selectedChat._id);
      if (file) {
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        });
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/message`,
        formData,
        config
      );
      socket.emit("new message", data);
      console.log("message sent successfully");
      setNewMessage("");
      setFile(null);
      setMessages([...messages, data]);
    } catch (error) {
      console.log("error sending message", error);
      return;
    }
  };

  //RETRIEVING ALL MSGS FROM DATABASE
  const fetchAllMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/api/message/${selectedChat._id}`,
        config
      );
      if (data) {
        console.log("messages retrieved successfully");
        setMessages(data);
        setLoading(false);
      } else {
        console.log("messages not retrieved ");
      }

      // //***************joining a particular chat*****************************
      socket.emit("join chat", selectedChat._id);
      // //***************joining a chat completed ***************************** */
    } catch (error) {
      console.log("error retrieving messages" + error);
      return;
    }
  };
  useEffect(() => {
    if (selectedChat) {
      fetchAllMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    const messageReceivedHandler = (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message recieved", messageReceivedHandler);

    // Cleanup function
    return () => {
      socket.off("message recieved", messageReceivedHandler);
    };
  }, [messages, fetchAgain, notifications]);
  return (
    <>
      <UpdateGChatModal
        visible={isUpdateGChatModal}
        onClose={() => setIsUpdateGChatModal(false)}
      />
      <SenderProfileOneOneChat
        visible={isSenderProfileVisible}
        onClose={() => setIsSenderProfileVisible(false)}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 5,
          gap: 15,
        }}
      >
        {/* Scrollable messages starts here  */}
        <View style={{ flex: 1 }}>
          <ScrollableChatWIthAllMsgs messages={messages} />
        </View>
        {/* Scrollable messages ends here  */}

        {/* Input of files, images, text starts here */}
        <View
          style={{
            flexDirection: "column",
          }}
        >
          {/* message input row */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
          >
            <Pressable onPress={pickFile}>
              <Ionicons
                name="add-circle-outline"
                size={35}
                style={{ color: "#3D737F", marginRight: 5 }}
              />
            </Pressable>

            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onChangeText={(text) => setNewMessage(text)}
              value={newMessage}
              placeholder="Type a message"
            />

            <Pressable onPress={sendMessage}>
              <Ionicons
                name="send"
                size={35}
                style={{ color: "#3D737F", marginLeft: 5 }}
              />
            </Pressable>
          </View>
          {/* message input row ends */}

          {/* image/ Doc Input preview */}
          {file && (
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              {file.mimeType.startsWith("image/") ? (
                <Image
                  source={{ uri: file.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 7,
                  }}
                />
              ) : (
                <Text>{file.name}</Text>
              )}
              <Pressable onPress={() => setFile(null)}>
                <Ionicons
                  name="close-circle"
                  size={25}
                  style={{ color: "#3D737F" }}
                />
              </Pressable>
            </View>
          )}
          {/* image/ Doc Input preview ends */}
        </View>
        {/* Input of files, images, text ends here */}
      </View>
    </>
  );
};

export default ChatBoxScreen;

const styles = StyleSheet.create({});
