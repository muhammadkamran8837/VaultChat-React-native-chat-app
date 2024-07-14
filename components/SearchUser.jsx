import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useChat } from "../context/Context";
import UserItem from "./UserItem";

const SearchUser = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const {
    user,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain,
    selectedChat,
    setselectedChat,
  } = useChat();

  useEffect(() => {
    // Fetch all users when the component mounts
    const fetchAllUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          "http://10.0.2.2:8000/api/user",
          config
        );
        setAllUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        Alert.alert(
          "Error",
          "Error fetching users,check your internet connection"
        );
      }
    };

    fetchAllUsers();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://10.0.2.2:8000/api/user?search=${query}`,
          config
        );
        if (searchQuery !== "") {
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      // If search query is empty, reset the filtered users to all users
      setFilteredUsers(allUsers);
    }
  };

  const createChat = async (userId) => {
    //here we are creating a new chat....
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://10.0.2.2:8000/api/chat`,
        { userId },
        config
      );
      //if there's no chat in the chats array with
      //the same _id as the newly created chat (data).
      //If no matching chat is found, it adds the
      //new chat (data) to the beginning of the chats array
      if (Array.isArray(chats) && chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setselectedChat(data);
    } catch (error) {
      Alert.alert("Error", "Could not create chat");

      return;
    }
  };
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            placeholder="Search..."
            clearButtonMode="always"
            autoCapitalize="none"
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
            }}
          />
          <TouchableOpacity onPress={onClose} style={{ marginLeft: 10 }}>
            <Ionicons name="close" size={25} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              handleFuncForCreateChat={() => {
                createChat(item._id);
                onClose();
              }}
            />
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SearchUser;
