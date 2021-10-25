import React from 'react';
import { AppRegistry, StatusBar, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './navigation/Navigations'
import * as Font from 'expo-font'
import { loadAsync } from 'expo-font';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <StatusBar barStyle='light-content' />
        <NavigationContainer>
          <NavigationStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}


AppRegistry.registerComponent('MyApplication', () => App);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: 'center',
    alignItems: 'center'
  }
});