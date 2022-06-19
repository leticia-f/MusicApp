import react from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import AudioListItem from './app/components/AudioListItem';
import color from './app/misc/color';

const MyTheme = {
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    backgroundColor: color.app_bg
  }
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
          <AppNavigator/>
      </NavigationContainer>
    </AudioProvider>
  )
}