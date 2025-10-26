//folder - components
//ChatScreen.js

import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Pic from "../assets/Pic.jpeg"; // You

export default function ChatScreen({ user, goBack, isDark }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const theme = {
    background: isDark ? "#0D0D0D" : "#F9FAFB",
    bubbleMine: "#007AFF",
    bubbleTheirs: isDark ? "#1E1E1E" : "#E9ECEF",
    text: isDark ? "#E5E5E5" : "#1C1C1E",
    placeholder: isDark ? "#aaa" : "#999",
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: input,
      fromMe: true,
      time: "Now",
    };
    setMessages([...messages, newMsg]);
    setInput("");
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
  messageRow: { marginVertical: 4 },
  myRow: { alignSelf: "flex-end" },
  theirRow: { alignSelf: "flex-start" },
  bubble: {
    padding: 10,
    borderRadius: 18,
    maxWidth: "75%",
    marginHorizontal: 6,
  },
  messageText: { fontSize: 15 },
  timeText: { fontSize: 11, textAlign: "right", marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  input: { flex: 1, marginHorizontal: 8, fontSize: 15 },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
  },
  avatarSmall: { width: 28, height: 28, borderRadius: 14, marginRight: 6 },
});