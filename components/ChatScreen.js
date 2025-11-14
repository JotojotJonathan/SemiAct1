// components/ChatScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { saveMessage, getMessages } from "../utils/db";

export default function ChatScreen({ user, goBack, isDark, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const theme = {
    background: isDark ? "#0D0D0D" : "#F9FAFB",
    bubbleMine: "#007AFF",
    bubbleTheirs: isDark ? "#1E1E1E" : "#E9ECEF",
    text: isDark ? "#E5E5E5" : "#1C1C1E",
    placeholder: isDark ? "#aaa" : "#999",
  };

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, [user.id]);

  const loadMessages = async () => {
    try {
      const savedMessages = await getMessages(currentUser.id, user.id);
      const formattedMessages = savedMessages.map(msg => ({
        id: msg.id.toString(),
        text: msg.message_text,
        fromMe: msg.sender_id === currentUser.id,
        time: formatTime(msg.timestamp),
        sender: msg.sender_name,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.log('Error loading messages:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      // Save message to database
      await saveMessage(currentUser.id, user.id, input.trim());
      
      // Reload messages to get the latest
      await loadMessages();
      
      // Clear input
      setInput("");
    } catch (error) {
      console.log('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Image source={user.avatar} style={styles.headerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerName, { color: theme.text }]}>
            {user.name}
          </Text>
          <Text
            style={{
              color: user.status === "Online" ? "#4CAF50" : theme.placeholder,
              fontSize: 12,
            }}
          >
            {user.status}
          </Text>
        </View>
        <Ionicons name="call-outline" size={22} color={theme.text} />
        <Ionicons
          name="videocam-outline"
          size={22}
          color={theme.text}
          style={{ marginLeft: 14 }}
        />
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              item.fromMe ? styles.myRow : styles.theirRow,
            ]}
          >
            {!item.fromMe && (
              <Image source={user.avatar} style={styles.avatarSmall} />
            )}
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: item.fromMe
                    ? theme.bubbleMine
                    : theme.bubbleTheirs,
                  alignSelf: item.fromMe ? "flex-end" : "flex-start",
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: item.fromMe ? "#fff" : theme.text },
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  { color: item.fromMe ? "#DDEEFF" : "#999" },
                ]}
              >
                {item.time}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={[styles.emptyChat, { color: theme.placeholder }]}>
            No messages yet. Start a conversation!
          </Text>
        }
      />

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.bubbleTheirs },
        ]}
      >
        <Ionicons name="happy-outline" size={24} color={theme.placeholder} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Message..."
          placeholderTextColor={theme.placeholder}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
            />
        <Ionicons
          name="attach-outline"
          size={22}
          color={theme.placeholder}
          style={{ marginHorizontal: 8 }}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 8,
  },
  headerName: { fontWeight: "600", fontSize: 17 },
  messageRow: { 
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  myRow: { 
    justifyContent: "flex-end",
  },
  theirRow: { 
    justifyContent: "flex-start",
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "75%",
    marginHorizontal: 6,
  },
  messageText: { fontSize: 16 },
  timeText: { 
    fontSize: 11, 
    textAlign: "right", 
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  input: { 
    flex: 1, 
    marginHorizontal: 8, 
    fontSize: 16,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmall: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    marginRight: 8,
  },
  emptyChat: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontStyle: 'italic',
  },
});
    