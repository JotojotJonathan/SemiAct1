//folder - screens
//NewsFeedScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import PostList from "../components/PostList";

// 🖼️ Local Images
import Pic from "../assets/Pic.jpeg";
import Pic1 from "../assets/Pic1.jpeg";
import Pic2 from "../assets/Pic2.jpeg";
import Pic4 from "../assets/Pic4.jpeg";
import Pic5 from "../assets/Pic5.jpeg";
import Pic6 from "../assets/Pic6.jpeg";

export default function NewsFeedScreen() {
  const [search, setSearch] = useState("");
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [posts, setPosts] = useState([
    {
      id: "1",
      user: "Jonathan",
      avatar: Pic,
      content: "Eyyyyyy",
      image: Pic4,
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: "2",
      user: "Smith",
      avatar: Pic1,
      content: "No Caption",
      image: Pic5,
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: "3",
      user: "Ryan",
      avatar: Pic2,
      content: "No Caption",
      image: Pic6,
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
    },
  ]);

  const filteredPosts = posts.filter(
    (p) =>
      p.user.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!postText.trim() && !selectedImage) return;

    const newPost = {
      id: Date.now().toString(),
      user: "Jonathan",
      avatar: Pic,
      content: postText.trim(),
      image: selectedImage ? { uri: selectedImage } : null,
      timestamp: Date.now(),
    };

    setPosts([newPost, ...posts]);
    setPostText("");
    setSelectedImage(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* 🧭 Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NewsFeed</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* 🧠 Post Box */}
        <View style={styles.postBox}>
          <Image source={Pic} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.postInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#888"
              value={postText}
              onChangeText={setPostText}
              multiline
            />

            {selectedImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close-circle" size={22} color="#f00" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="image" size={20} color="#007BFF" />
                <Text style={styles.imageButtonText}>Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePost}
                style={[
                  styles.postButton,
                  (!postText.trim() && !selectedImage) && { opacity: 0.5 },
                ]}
                disabled={!postText.trim() && !selectedImage}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 📰 Post List */}
        <View style={styles.postListWrapper}>
          <PostList posts={filteredPosts} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 10,
    width: "50%",
    height: 36,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 14,
    color: "#000",
  },
  postBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
    minHeight: 40,
    textAlignVertical: "top",
  },
  previewContainer: { marginTop: 8, position: "relative" },
  preview: { width: "100%", height: 180, borderRadius: 10 },
  removeImageButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imageButton: { flexDirection: "row", alignItems: "center" },
  imageButtonText: { marginLeft: 6, color: "#007BFF", fontWeight: "500" },
  postButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonText: { color: "#fff", fontWeight: "bold" },
  postListWrapper: { flex: 1 },
});


