import React, { useState } from 'react';
import { View, Button } from 'react-native';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';


export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Chat');

  const renderScreen = () => {
    if (currentScreen === 'Home') {
      return <HomeScreen setCurrentScreen={setCurrentScreen} />;
    } else if (currentScreen === 'Profile') {
      return <ProfileScreen setCurrentScreen={setCurrentScreen} />;
    } else if (currentScreen === 'Chat') {
      return <ChatScreen setCurrentScreen={setCurrentScreen} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
}