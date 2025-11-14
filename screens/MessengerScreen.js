// screens/MessengerScreen.js
import React, { useState, useEffect } from "react";
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
import { getAllUsers, getConversations } from "../utils/db";

// Local pictures (fallback)
import Pic from "../assets/Pic.jpeg";

export default function MessengerScreen({ currentUser }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    background: isDark ? "#0D0D0D" : "#F9FAFB",
    card: isDark ? "#1A1A1A" : "#FFFFFF",
    text: isDark ? "#E5E5E5" : "#1C1C1E",
    placeholder: isDark ? "#999" : "#888",
    accent: "#007AFF",
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const dbUsers = await getAllUsers();
      
      // Filter out the current user from the list and ensure name exists
      const otherUsers = dbUsers
        .filter(user => user.id !== currentUser?.id)
        .map(user => ({
          ...user,
          name: user.username || user.email || 'Unknown User',
          status: Math.random() > 0.5 ? "Online" : "Offline",
          lastMessage: "Tap to start conversation",
          lastTime: "",
          unreadCount: 0,
          avatar: user.avatar ? { uri: user.avatar } : Pic
        }));

      // Try to load real conversation data
      try {
        const conversations = await getConversations(currentUser.id);
        conversations.forEach(conv => {
          const userIndex = otherUsers.findIndex(u => u.id === conv.user_id);
          if (userIndex !== -1) {
            otherUsers[userIndex].lastMessage = conv.last_message || "Tap to start conversation";
            otherUsers[userIndex].lastTime = formatTime(conv.timestamp);
          }
        });
      } catch (convError) {
        console.log('Error loading conversations:', convError);
      }

      setUsers(otherUsers);
    } catch (error) {
      console.log('Error loading users:', error);
      setUsers(getDemoUsers());
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getDemoUsers = () => [
    {
      id: "1",
      name: "Smith",
      username: "smith",
      avatar: Pic,
      status: "Online",
      lastMessage: "See you later! 👋",
      lastTime: "2:45 PM",
      unreadCount: 2,
    },
    {
      id: "2", 
      name: "Ryan",
      username: "ryan",
      avatar: Pic,
      status: "Offline",
      lastMessage: "Working on a project 💻",
      lastTime: "11:12 AM",
      unreadCount: 0,
    },
  ];

  // FIXED: Add null check for user.name
  const filteredUsers = users.filter((u) =>
    u.name && u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedChat) {
    return (
      <ChatScreen
        user={selectedChat}
        goBack={() => setSelectedChat(null)}
        isDark={isDark}
        currentUser={currentUser}
      />
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
          Loading users...
        </Text>
      </View>
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
                <Image 
                  source={user.avatar} 
                  style={styles.headAvatar} 
                  defaultSource={Pic}
                />
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
                {user.name || 'Unknown'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chatCard,
              { backgroundColor: theme.card, shadowColor: theme.text },
            ]}
            onPress={() => setSelectedChat(item)}
          >
            <Image 
              source={item.avatar} 
              style={styles.avatar} 
              defaultSource={Pic}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.name || 'Unknown User'}
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
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No users found. Register more accounts to chat!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 28, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    marginBottom: 6,
  },
  searchInput: { flex: 1, fontSize: 15 },
  headContainer: {
    marginBottom: 6,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});