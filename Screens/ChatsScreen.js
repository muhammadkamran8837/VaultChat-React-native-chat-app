import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useChat } from "../context/Context";
import axios from "axios";
import { getSender } from "../ChatLogics/ChatLogics";
import UserAvatar from "react-native-user-avatar";
import { useNavigation } from "@react-navigation/native";
import { Badge } from "react-native-paper"; // Import Badge from react-native-paper

const ChatsScreen = () => {
  const {
    user,
    selectedChat,
    setselectedChat,
    chats,
    setChats,
    fetchAgain,
    notifications,
  } = useChat();
  const navigation = useNavigation();

  const [loggedUser, setLoggedUser] = useState();

  const fetchAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get("http://10.0.2.2:8000/api/chat", config);
      setChats(response.data);
    } catch (error) {
      Alert.alert("Error", "Couldn't Fetch Chats");
      console.log("chats not fetched" + error);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, [fetchAgain, chats]);

  return (
    <View style={{ flex: 1, marginHorizontal: 20 }}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setselectedChat(item), navigation.navigate("ChatBoxScreen");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <UserAvatar
                size={40}
                name={
                  !item.isGroupChat
                    ? getSender(user, item.users)
                    : item.chatName
                }
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "500", fontSize: 14 }}>
                  {!item.isGroupChat
                    ? getSender(user, item.users)
                    : item.chatName}
                </Text>
                <Text style={{ color: "#373A40" }}>
                  {item.latestMessage
                    ? item.latestMessage.content || "Photo"
                    : "No messages yet"}
                </Text>
              </View>
              {notifications.some((n) => n.item._id === item._id) && (
                <Badge
                  size={20}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  {notifications.filter((n) => n.item._id === item._id).length}
                </Badge>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
