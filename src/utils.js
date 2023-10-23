/*
mode setting
setMode(mode === 'dark' ? 'light' : 'dark')
try {
    await AsyncStorage.setItem('theme', mode === 'dark' ? 'light' : 'dark');
} catch (e) {
    console.log(e)
}

chat gpt api
const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = '<open-ai-key>';
const inputPrompt = options.prompt;
fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{
            "role": "system",
            "content": "You are ChatGPT, a helpful assistant."
        }, {
            "role": "user",
            "content": "Your input prompt here."
        }]
    })
}).then(response => {
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}).then(data => {
    console.log(data.choices[0].message.content);
}).catch(error => {
    console.error('Error:', error);
});

*/
import { useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export const getStorageData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const selectImage = (callback) => {
  let options = {
    title: 'Select Image'
  }

  launchImageLibrary(options, res => {
    if (res.didCancel) {
      console.log('User cancelled image picker');
      callback({
        error: true,
        source: null
      })
    } else if (res.error) {
      console.log('ImagePicker Error: ', res.error);
      callback({
        error: true,
        source: null
      })
    } else {
      callback({
        error: false,
        source: res.assets[0].uri
      })
    }
  })
}

export const uploadImage = async (path, imageSrc) => {
  const reference = storage().ref(path);
  await reference.putFile(imageSrc);
}

export const getImage = async (path) => {
  const url = await storage().ref(path).getDownloadURL();
  console.log('s', url)
  return url;
}

export const createId = () => {
  return Math.random().toString(36).substring(7);
}

export const getCurrentDate = () => {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let date = new Date();

  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  const finalDate = `${month} ${day} ${year}`;

  return finalDate
}

export const getDiffBetweenDates = (date1, date2) => {
  let oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  return diffDays.toString();
}

export const search = (data, text) => {
  const newData = data.filter(item => {      
    const itemData = `${item.participantTwo}`.toUpperCase();
    
     const textData = text.toUpperCase();
      
     return itemData.indexOf(textData) > -1;    
  });
  
  return newData;
}