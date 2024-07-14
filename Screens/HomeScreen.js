import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatsScreen from "./ChatsScreen";
import NewsUpdatesScreen from "./NewsUpdatesScreen";
import SearchUser from "../components/SearchUser";
import CreateGroupChatModal from "../components/CreateGroupChatModal";
import CustomMenu from "../components/CustomMenu";

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isGroupChatModal, setGroupChatModal] = useState(false);
  const [isCustomMenu, setIsCustomMenu] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => setIsCustomMenu(true)}>
            <Ionicons name="menu-outline" size={30} color="#3D737F" />
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#3D737F" }}>
            VaultChat
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable onPress={() => setGroupChatModal(true)}>
            <Ionicons name="people-outline" size={20} />
          </Pressable>
          <Pressable onPress={() => setSearchVisible(true)}>
            <Ionicons name="search-outline" size={20} />
          </Pressable>
        </View>
      ),
      title: "",
    });
  }, [navigation]);
  return (
    <>
      <SearchUser
        visible={isSearchVisible}
        onClose={() => setSearchVisible(false)}
      />
      <CreateGroupChatModal
        visible={isGroupChatModal}
        onClose={() => setGroupChatModal(false)}
      />
      <CustomMenu
        visible={isCustomMenu}
        onClose={() => setIsCustomMenu(false)}
      />
      {!isSearchVisible && (
        <Tab.Navigator>
          <Tab.Screen name="Chats" component={ChatsScreen} />
          <Tab.Screen name="News Updates" component={NewsUpdatesScreen} />
        </Tab.Navigator>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
