//folder - components
//CommentSection.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import Pic from "../assets/Pic.jpeg"; // your avatar (User1)

export default function CommentSection() {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const handleAddComment = () => {
    if (commentText.trim() === "") return;

    const newComment = {
      id: Date.now().toString(),
      user: "User1",
      avatar: Pic,
      text: commentText.trim(),
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <View style={styles.container}>
      {/* Comments list */}
      {comments.length === 0 ? (
        <Text style={styles.noComments}>No comments yet — be the first to comment!</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Image
                source={typeof item.avatar === "string" ? { uri: item.avatar } : item.avatar}
                style={styles.avatar}
              />
              <View style={styles.commentBody}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Add comment input */}
      <View style={styles.inputContainer}>
        <Image source={Pic} style={styles.avatar} />
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.button}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  noComments: {
    color: "#888",
    fontSize: 13,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentBody: {
    backgroundColor: "#e9e9e9",
    borderRadius: 10,
    padding: 8,
    flex: 1,
  },
  user: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
  },
  text: { fontSize: 13 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    color: "#000",
  },
  button: { paddingHorizontal: 8 },
  buttonText: { color: "#007BFF", fontWeight: "bold" },
});