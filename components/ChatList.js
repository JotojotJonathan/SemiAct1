// folder - components
//ChatList.js
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function ChatList({ users, onSelect }) {
  return (
    <View style={styles.container}>
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={styles.chatItem}
          onPress={() => onSelect(user)}
        >
          <Image
            source={
              typeof user.avatar === "string"
                ? { uri: user.avatar }
                : user.avatar
            }
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.row}>
              <Text style={styles.name}>{user.name}</Text>
              <Text
                style={[
                  styles.status,
                  { color: user.status === "Online" ? "#4CAF50" : "#999" },
                ]}
              >
                {user.status}
              </Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {user.lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
});
