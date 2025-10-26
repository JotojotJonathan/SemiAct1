//folder - navigation
//TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MessengerScreen from "../screens/MessengerScreen";
import NewsFeedScreen from "../screens/NewsFeedScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "NewsFeed") {
            iconName = "home";
          } else if (route.name === "Messenger") {
            iconName = "chatbubbles";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="NewsFeed" component={NewsFeedScreen} />
      <Tab.Screen name="Messenger" component={MessengerScreen} />
    </Tab.Navigator>
  );
}
