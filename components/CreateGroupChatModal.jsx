import {
  Alert,
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import UserItem from "./UserItem";
import { useChat } from "../context/Context";
import axios from "axios";
import BatchItems from "./BatchItems";

const CreateGroupChatModal = ({ visible, onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useChat();
  //FETCHING ALL USERS.
  useEffect(() => {
    // Fetch all users when the component mounts
    const fetchAllUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(
          "http://10.0.2.2:8000/api/user",
          config
        );
        setAllUsers(response.data);
        setFilteredUsers(response.data);
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

  //FILTERING USERS BASED ON INPUT QUERY
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(
          `http://10.0.2.2:8000/api/user?search=${query}`,
          config
        );
        if (searchQuery !== "") {
          setFilteredUsers(response.data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      // If search query is empty, reset the filtered users to all users
      setFilteredUsers(allUsers);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      Alert.alert("Error", "User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // CREATE GROUP CHAT API CALLING
  const handleSubmitForCreatingGroup = async () => {
    if (!groupChatName && !selectedUsers) {
      Alert.alert(
        "Error",
        "Group name and at least two users must be specified"
      );
      return;
    }
    const existingGroup = chats.find((chat) => chat.chatName === groupChatName);
    if (existingGroup) {
      Alert.alert("Error", "Group name already exists");

      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://10.0.2.2:8000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((selected) => selected._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setLoading(false);
      Alert.alert("Success", "Group created successfully");
      onClose();
    } catch (e) {
      Alert.alert("Error", "Error creating group");
      setLoading(false);
      onClose();
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== userToDelete._id)
    );
  };

  

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Create a Group Chat</Text>
          <TouchableOpacity onPress={onClose} style={{ marginLeft: 10 }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "column",
            gap: 10,
          }}
        >
          <TextInput
            placeholder="Enter Group Name..."
            value={groupChatName}
            onChangeText={(name) => setGroupChatName(name)}
            clearButtonMode="always"
            autoCapitalize="none"
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
            }}
          />
          <TextInput
            placeholder="Add users to group"
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
            clearButtonMode="always"
            autoCapitalize="none"
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
            }}
          />
          <FlatList
            style={{ flexDirection: "row" }}
            data={selectedUsers}
            keyExtractor={(user) => user._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <BatchItems
                user={item}
                handleFunctionForDeletion={() => handleDelete(item)}
              />
            )}
          />

          <Pressable
            onPress={() => {
              handleSubmitForCreatingGroup();
              setGroupChatName("");
            }}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Text style={{ color: "#3D737F", fontWeight: "bold" }}>
              {loading ? "Creating group..." : "Create Group"}
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              handleFuncForCreateChat={() => {
                handleGroup(item);
              }}
            />
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default CreateGroupChatModal;

const styles = StyleSheet.create({});
