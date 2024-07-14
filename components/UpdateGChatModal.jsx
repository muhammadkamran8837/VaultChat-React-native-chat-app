import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import UserItem from "./UserItem"; // assuming you have a UserItem component
import BatchItems from "./BatchItems"; // importing BatchItems component
import axios from "axios";
import { useChat } from "../context/Context"; // assuming useChat is from your context

const UpdateGChatModal = ({ visible, onClose }) => {
  const { user, selectedChat, setselectedChat, fetchAgain, setFetchAgain } =
    useChat();
  const [newGroupName, setNewGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedUsers, setAddedUsers] = useState([]);
  // Helper function to ensure unique users
  const uniqueUsers = (users) => {
    const seen = new Set();
    return users.filter((user) => {
      const isDuplicate = seen.has(user._id);
      seen.add(user._id);
      return !isDuplicate;
    });
  };
  const handleRemoveUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      Alert.alert("Error", "Only admins can remove users");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://10.0.2.2:8000/api/chat/groupRemove`,
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      // if the user  who has been removed is the the user himself,
      //i.e. he has left the group then we show the selected chat to be empty,
      // otherwise selectedchat with updated data
      userToRemove._id === user._id ? setselectedChat() : setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      Alert.alert("Success", "User removed successfully");
    } catch (error) {
      Alert.alert("Couldnt remove user", error.message);
    }
  };
  const handleAddUser = async (userToAdd) => {
    if (
      selectedChat.users.find(
        (existingusers) => existingusers._id === userToAdd._id
      )
    ) {
      Alert.alert("User Already Added", "Please select a new user");
      return;
    }
    //checking if the person who is adding new member is group admin or not,
    //if someone who is not a group admina and tries to add new user, error will occur
    if (selectedChat.groupAdmin._id !== user._id) {
      Alert.alert(
        "Only admins can add users",
        "Please contact the administrator"
      );
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://10.0.2.2:8000/api/chat/groupAdd`,
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      Alert.alert("Success", "User added to group successfully");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to add user to group");
    }
  };

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
  const handleNewGroupChatName = async () => {
    if (!newGroupName) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://10.0.2.2:8000/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: newGroupName,
        },
        config
      );
      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      onClose();
      Alert.alert("Success", "Group was renamed successfully");
    } catch (error) {
      Alert.alert("Error Renaming Group", error.message);
      setNewGroupName("");
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <SafeAreaView
          style={{
            width: "90%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center" }}>
            {selectedChat.chatName}
          </Text>

          {/* Existing Group Members Starts */}
          <View>
            <Text style={{ color: "#3D737F", marginBottom: 5 }}>
              Group Members
            </Text>
            <FlatList
              data={uniqueUsers(selectedChat.users)}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <UserItem
                  user={item}
                  handleFuncForCreateChat={() => {
                    handleRemoveUser(item);
                  }}
                />
              )}
              style={{ maxHeight: 150, marginBottom: 10 }}
            />
          </View>
          {/* Existing Group Members ENds */}

          {/* LIst of All Users Starts */}

          <View>
            <TextInput
              placeholder="Search and tap to add members"
              value={searchQuery}
              onChangeText={(query) => handleSearch(query)}
              clearButtonMode="always"
              autoCapitalize="none"
              style={{
                paddingVertical: 5,
                borderColor: "#ccc",
                borderWidth: 0,
                borderBottomWidth: 1,
              }}
            />
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <UserItem
                  user={item}
                  handleFuncForCreateChat={() => {
                    handleAddUser(item);
                  }}
                />
              )}
              style={{ maxHeight: 200, marginBottom: 10 }}
            />
          </View>
          {/* LIst of All Users Ends */}

          {/* Change Group Name */}
          <View>
            <Text style={{ color: "#3D737F" }}>Change Group name</Text>
            <TextInput
              placeholder="Enter Group Name..."
              value={newGroupName}
              onChangeText={(name) => setNewGroupName(name)}
              clearButtonMode="always"
              autoCapitalize="none"
              style={{
                paddingVertical: 5,
                borderColor: "#ccc",
                borderWidth: 0,
                borderBottomWidth: 1,
              }}
            />
          </View>
          {/* Change Group Name Ends */}

          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: "#3D737F",
              borderRadius: 5,
              alignSelf: "flex-end",
            }}
            onPress={handleNewGroupChatName}
          >
            <Text style={{ color: "white" }}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 10,
              borderRadius: 5,
              alignSelf: "flex-end",
            }}
          >
            <Text style={{ color: "red" }}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default UpdateGChatModal;
