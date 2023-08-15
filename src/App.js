import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTheme, ThemeProvider } from '@rneui/themed';
import { PRIMARY_COLOR } from './constants';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import BlogCreate from './screens/BlogCreate';
import BlogDetails from './screens/BlogDetails';

const theme = createTheme({
  lightColors: {
    primary: PRIMARY_COLOR,
    secondary: 'black',
    background: 'white'
  },
  darkColors: {
    primary: 'white',
    secondary: 'white',
    background: '#080808'
  },
  mode: 'light'
});

const Stack = createNativeStackNavigator();

function App() {
  const [themeObject, setThemeObject] = useState(null);
  async function getData(key){
    try {
      const data = await AsyncStorage.getItem(key);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    getData('theme')
      .then(data=>{
        setThemeObject(createTheme({
          lightColors: {
            primary: PRIMARY_COLOR,
            secondary: 'black',
            background: 'white'
          },
          darkColors: {
            primary: 'white',
            secondary: 'white',
            background: '#080808'
          },
          mode: data != null ? data.toString() : 'light'
        }))
        console.log('d', data)
      })
      .catch(err => console.log(err))
  }, [])
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={themeObject !== null ? themeObject : theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{
              headerShown: false
            }} />
            <Stack.Screen name="BlogCreate" component={BlogCreate} options={{
              headerShown: false
            }} />
            <Stack.Screen name="BlogDetails" component={BlogDetails} options={{
              headerShown: false
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default withAuthenticator(App);
