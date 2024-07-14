import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import UserAvatar from "react-native-user-avatar";

const UserItem = ({ user, handleFuncForCreateChat }) => {
  return (
    <TouchableOpacity onPress={handleFuncForCreateChat}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
        <UserAvatar size={40} name={user.name} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{user.name}</Text>
          <Text style={{ fontSize: 14, color: "#555" }}>{user.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;
