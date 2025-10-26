import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatScreen from "../components/ChatScreen";

// Local pictures
import Pic from "../assets/Pic.jpeg";
import Pic1 from "../assets/Pic1.jpeg";
import Pic2 from "../assets/Pic2.jpeg";

export default function MessengerScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);

  const theme = {
    background: isDark ? "#0D0D0D" : "#F9FAFB",
    card: isDark ? "#1A1A1A" : "#FFFFFF",
    text: isDark ? "#E5E5E5" : "#1C1C1E",
    placeholder: isDark ? "#999" : "#888",
    accent: "#007AFF",
  };

  const users = [
    {
      id: "1",
      name: "Smith",
      avatar: Pic1,
      status: "Online",
      lastMessage: "See you later! 👋",
      lastTime: "2:45 PM",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Ryan",
      avatar: Pic2,
      status: "Offline",
      lastMessage: "Working on a project 💻",
      lastTime: "11:12 AM",
      unreadCount: 0,
    },
    {
      id: "0",
      name: "Jonathan",
      avatar: Pic,
      status: "Online",
      lastMessage: "Hey there! 😊",
      lastTime: "Yesterday",
      unreadCount: 5,
    },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedChat) {
    return (
      <ChatScreen
        user={selectedChat}
        goBack={() => setSelectedChat(null)}
        isDark={isDark}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Messenger</Text>
        <TouchableOpacity onPress={() => setIsDark(!isDark)}>
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: theme.card, shadowColor: theme.text },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.placeholder}
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search chats..."
          placeholderTextColor={theme.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Chat heads */}
      <View style={styles.headContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.headScrollContent}
        >
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.headItem}
              onPress={() => setSelectedChat(user)}
            >
              <View>
                <Image source={user.avatar} style={styles.headAvatar} />
                {user.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{user.unreadCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[styles.headName, { color: theme.text }]}
                numberOfLines={1}
              >
                {user.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chatCard,
              { backgroundColor: theme.card, shadowColor: theme.text },
            ]}
            onPress={() => setSelectedChat(item)}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={styles.time}>{item.lastTime}</Text>
              </View>
              <Text
                numberOfLines={1}
                style={[styles.lastMessage, { color: theme.placeholder }]}
              >
                {item.lastMessage}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadgeSmall}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 28, fontWeight: "700" },

  // Search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    marginBottom: 6, // ✅ reduced (was 10) → tighter layout
  },
  searchInput: { flex: 1, fontSize: 15 },

  // Chat heads
  headContainer: {
    marginBottom: 6, // ✅ tightened (was more before)
  },
  headScrollContent: {
    paddingHorizontal: 10,
    gap: 14,
  },
  headItem: {
    alignItems: "center",
    width: 68,
  },
  headAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  headName: {
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
  unreadBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    alignItems: "center",
  },
  unreadBadgeSmall: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Chat list
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 12,
    elevation: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  lastMessage: {
    marginTop: 2,
    fontSize: 14,
  },
});