/*
mode setting
setMode(mode === 'dark' ? 'light' : 'dark')
try {
    await AsyncStorage.setItem('theme', mode === 'dark' ? 'light' : 'dark');
} catch (e) {
    console.log(e)
}

*/
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

export const getImage = async(path) => {
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