import React, { useState } from 'react';
import { View, Button } from 'react-native';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import UltimateResultScreen from './UltimateResult';


export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [finalResult, setFinalResult] = useState()
  const [goods, setGoods] = useState([]);
  const [bads, setBads] = useState([]);
  const [allHealth, setAllHealth] = useState([])
  const [gaOutput, setGaOutput] = useState([])
  const [user, setUser] = useState({})


  const renderScreen = () => {
    if (currentScreen === 'Home') {
      return <HomeScreen currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />;
    } else if (currentScreen === 'Profile') {
      return <ProfileScreen setCurrentScreen={setCurrentScreen} setGoods={setGoods} setBads={setBads} setAllHealth={setAllHealth} setGaOutput={setGaOutput} setUser={setUser} />;
    } else if (currentScreen === 'Chat') {
      return <ChatScreen setCurrentScreen={setCurrentScreen} finalResult={finalResult} setFinalResult={setFinalResult} goods={goods} bads={bads} allHealth={allHealth} gaOutput={gaOutput} />;
    } else if (currentScreen === 'Result') {
      return <UltimateResultScreen setCurrentScreen={setCurrentScreen} finalResult={finalResult} user={user} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
}