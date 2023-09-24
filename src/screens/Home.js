/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../features/user/userSlice';
import { updateLikedBlog, updateUnlikedBlog } from '../features/blog/blogSlice';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { useFetchBlogs } from '../hooks/dbRequests';
import { useThemeMode, ThemeConsumer } from '@rneui/themed';
import BottomTab from '../components/layout/BottomTab';
import Header from '../components/layout/Header';
import BlogCard from '../components/ui/BlogCard';
import Onboarding from '../components/ui/Onboarding';
import { likeBlog, unlikeBlog } from '../database/services/mutations';
import { isRegistered } from '../database/services/queries';
import ImageView from "react-native-image-viewing";

const userSelector = (context) => [context.user]

function Home({ navigation }) {
  const { user, signOut } = useAuthenticator(userSelector);
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blog.data);
  const users = useSelector(state => state.user.data);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [notRegistered, setNotRegistered] = useState(false);

  useFetchBlogs();

  useEffect(()=>{
    async function checkRegistered() {
      const regObj = await isRegistered(user.attributes.email)
      setNotRegistered(regObj[0])
      dispatch(setUsers([...regObj[1]]))
    }
    checkRegistered()
  }, [])

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Header navigation={navigation} text="E-Blogger" />
          <Onboarding
            visible={notRegistered}
            email={user.attributes.email}
            onClose={()=>{
              setNotRegistered(false)
            }}/>
          {/* <TouchableOpacity onPress={signOut}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: theme.colors.secondary }}> Sign Out </Text>
          </TouchableOpacity> */}
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
            extraData={blogs}
            renderItem={({ item, index }) => {
              return (
                <BlogCard
                  item={item}
                  navigation={navigation}
                  isLastItem={index === blogs.length - 1}
                  isLiked={item?.likedBy.indexOf(user.attributes.email) >= 0 ? true : false}
                  onLike={() => {
                    likeBlog(item.blogId, user.attributes.email)
                    dispatch(updateLikedBlog({id: item.blogId, email: user.attributes.email}))
                  }} 
                  onUnlike={() => {
                    unlikeBlog(item.blogId, user.attributes.email)
                    dispatch(updateUnlikedBlog({id: item.blogId, email: user.attributes.email}))
                  }} 
                  onImagePressed={()=>{
                    setSelectedImage(item.thumbnail);
                    setIsVisible(true);
                  }}
                  user={users.filter((user)=>{return user.email === item.author})[0]}
                  marginBottomVal={85}/>
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
