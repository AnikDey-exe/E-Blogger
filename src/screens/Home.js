/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { useSelector } from 'react-redux';
import { useFetchBlogs } from '../hooks/dbRequests';
import { useThemeMode, ThemeConsumer } from '@rneui/themed';
import BottomTab from '../components/layout/BottomTab';
import Header from '../components/layout/Header';
import BlogCard from '../components/ui/BlogCard';
import { likeBlog } from '../database/services/mutations';
import ImageView from "react-native-image-viewing";

const userSelector = (context) => [context.user]

const images = [
  {
    uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
  },
  {
    uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
  },
  {
    uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
  },
];

function Home({ navigation }) {
  const { user, signOut } = useAuthenticator(userSelector);
  const blogs = useSelector(state => state.blog.data);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useFetchBlogs()

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Header navigation={navigation} text="E-Blogger" />
          {/* <TouchableOpacity onPress={signOut}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: theme.colors.secondary }}> Sign Out </Text> */}
          {/* </TouchableOpacity> */}
          <ImageView
            images={[{
              uri: selectedImage
            }]}
            imageIndex={0}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
          />
          <FlatList
            data={blogs}
            renderItem={({ item, index }) => {
              return (
                <BlogCard
                  item={item}
                  isLastItem={index === blogs.length - 1}
                  isLiked={item.likedBy.indexOf(user.attributes.email) >= 0 ? true : false}
                  onLike={() => {
                    likeBlog(item.blogId, user.attributes.email)
                  }} 
                  onImagePressed={()=>{
                    setSelectedImage(item.thumbnail);
                    setIsVisible(true);
                  }}/>
              )
            }
            }
            keyExtractor={item => item._id} />
          <BottomTab navigation={navigation} currentTab="Home" />
        </View>
      )}
    </ThemeConsumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Home;
