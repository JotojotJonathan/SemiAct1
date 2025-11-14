import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MessengerScreen from "../screens/MessengerScreen";
import NewsFeedScreen from "../screens/NewsFeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ currentUser, setIsLoggedIn }) {
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
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="NewsFeed">
        {props => <NewsFeedScreen {...props} currentUser={currentUser} />}
      </Tab.Screen>
      <Tab.Screen name="Messenger">
        {props => <MessengerScreen {...props} currentUser={currentUser} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {props => (
          <ProfileScreen 
            {...props} 
            currentUser={currentUser} 
            setIsLoggedIn={setIsLoggedIn} 
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}