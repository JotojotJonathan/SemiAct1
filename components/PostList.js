//folder - components
//PostList.js

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import CommentSection from "./CommentSection";

const { width } = Dimensions.get("window");

const timeAgo = (timestamp) => {
  if (!timestamp) return "";
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function PostList({ posts }) {
  const [reactions, setReactions] = useState({});

  useEffect(() => {
    setReactions((prev) => {
      const next = { ...prev };
      posts.forEach((p) => {
        if (!next[p.id]) {
          next[p.id] = {
            liked: false,
            hearts: false,
            likesCount: 0,
            heartsCount: 0,
          };
        }
      });
      return next;
    });
  }, [posts]);

  const toggleLike = (postId) => {
    setReactions((prev) => {
      const post = prev[postId];
      const newLiked = !post.liked;
      return {
        ...prev,
        [postId]: {
          ...post,
          liked: newLiked,
          likesCount: Math.max(0, post.likesCount + (newLiked ? 1 : -1)),
        },
      };
    });
  };

  const toggleHeart = (postId) => {
    setReactions((prev) => {
      const post = prev[postId];
      const newHeart = !post.hearts;
      return {
        ...prev,
        [postId]: {
          ...post,
          hearts: newHeart,
          heartsCount: Math.max(0, post.heartsCount + (newHeart ? 1 : -1)),
        },
      };
    });
  };

  const renderItem = useCallback(
    ({ item }) => {
      const r =
        reactions[item.id] || {
          liked: false,
          hearts: false,
          likesCount: 0,
          heartsCount: 0,
        };

      return (
        <View style={styles.postWrapper}>
          <View style={styles.postCard}>
            {/* 👤 Header */}
            <View style={styles.header}>
              <Image
                source={typeof item.avatar === "string" ? { uri: item.avatar } : item.avatar}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.time}>{timeAgo(item.timestamp)}</Text>
              </View>
            </View>

            {/* 🧠 Content */}
            {item.content ? (
              <Text style={styles.content}>{item.content}</Text>
            ) : null}

            {/* 🖼️ Image */}
            {item.image && (
              <Image
                source={typeof item.image === "string" ? { uri: item.image } : item.image}
                style={styles.postImage}
              />
            )}

            {/* ❤️ Reactions */}
            <View style={styles.reactionRow}>
              <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.reactionButton}>
                <Text style={[styles.reactionText, r.liked && styles.likedText]}>
                  👍 {r.likesCount}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleHeart(item.id)} style={styles.reactionButton}>
                <Text style={[styles.reactionText, r.hearts && styles.heartedText]}>
                  ❤️ {r.heartsCount}
                </Text>
              </TouchableOpacity>

              <View style={styles.reactionButton}>
                <Text style={styles.reactionText}>💬 Comment</Text>
              </View>
            </View>

            {/* 💬 Comments */}
            <CommentSection />
          </View>
        </View>
      );
    },
    [reactions]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  postWrapper: { paddingHorizontal: 0 },
  postCard: {
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  user: { fontWeight: "bold", fontSize: 16, color: "#222" },
  time: { fontSize: 12, color: "#888" },
  content: { marginBottom: 8, fontSize: 14, color: "#333" },
  postImage: {
    width: "100%",
    height: width * 0.55,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  reactionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  reactionText: { fontSize: 14, color: "#555" },
  likedText: { color: "#007BFF", fontWeight: "700" },
  heartedText: { color: "#FF3B3B", fontWeight: "700" },
});
