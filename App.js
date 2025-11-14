// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './navigation/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { initDatabase } from './utils/db';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.log('Database initialization failed:', error);
      }
    };
    
    initializeDB();
  }, []);

  if (!dbInitialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {props => (
                <LoginScreen 
                  {...props} 
                  setIsLoggedIn={setIsLoggedIn} 
                  setCurrentUser={setCurrentUser} 
                />
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {props => (
              <TabNavigator 
                {...props} 
                currentUser={currentUser} 
                setIsLoggedIn={setIsLoggedIn} 
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}