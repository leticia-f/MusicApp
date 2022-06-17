import react from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import AudioListItem from './app/components/AudioListItem';

export default function App() {
  return (
    <View>
    {/* <AudioProvider>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </AudioProvider> */}
      <View style={{marginTop:50}}>
        <AudioListItem/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
