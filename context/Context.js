import React, { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VaultChatContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setselectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUserData();
  }, []);

  return (
    <VaultChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        selectedChat,
        setselectedChat,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </VaultChatContext.Provider>
  );
};

const useChat = () => {
  return useContext(VaultChatContext);
};

export { ContextProvider, useChat };
