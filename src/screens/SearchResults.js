import React, { useState, useEffect, useCallback } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import { updateLikedBlog, updateUnlikedBlog } from '../features/blog/blogSlice';
import AltHeader from '../components/layout/AltHeader';
import BlogCard from '../components/ui/BlogCard';
import UserCard from '../components/ui/UserCard';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { likeBlog, unlikeBlog } from '../database/services/mutations';
import ImageView from 'react-native-image-viewing';

const userSelector = (context) => [context.user]

function SearchResults({ route, navigation }) {
    const { searchTerm } = route.params;
    const state = useSelector(state => state.blog.data)
    const filterBlogs = createSelector(state => state, items => {
        return items
            .filter((item) => { return item.status === "published" })
            .filter((item) => {
                return item.title.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1 || item.hashtagCategory.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1
            })
    })
    const filteredBlogs = filterBlogs(state)

    const dispatch = useDispatch();

    const { user, signOut } = useAuthenticator(userSelector);
    const state2 = useSelector(state => state.user.data);
    const filterUsers = createSelector(state => state2, items => {
        return items
            .filter((item) => {
                return item.handle.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1
            })
    })
    const filteredUsers = filterUsers(state2)
    // const blogs = useSelector(state => 
    //                             state.blog.data
    //                                 .filter((item)=>{return item.status === "published"})
    //                                 .filter((item)=>{
    //                                     return item.title.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1 || item.hashtagCategory.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1
    //                                 })
    //                         );

    const [tab, setTab] = useState('Blogs');

    const [isVisible, setIsVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D');
    const [count, setCount] = useState(0);

    const stateChange = (item) => {
        console.log('clicked')
        setIsVisible(true);
    }
    const handleImageChange = useCallback((item)=>{
       stateChange(item)
    }, [])

    const handleImageClose = useCallback((item)=>{
        setIsVisible(false);
    }, [isVisible])

    const renderItem = useCallback(({ item, index }) => {
        return (
            <BlogCard
                item={item}
                navigation={navigation}
                isLastItem={index === filteredBlogs.length - 1}
                isLiked={item?.likedBy.indexOf(user.attributes.email) >= 0 ? true : false}
                onLike={() => {
                    likeBlog(item.blogId, user.attributes.email)
                    dispatch(updateLikedBlog({ id: item.blogId, email: user.attributes.email }))
                }}
                onUnlike={() => {
                    unlikeBlog(item.blogId, user.attributes.email)
                    dispatch(updateUnlikedBlog({ id: item.blogId, email: user.attributes.email }))
                }}
                onImagePressed={handleImageChange}
                user={state2.filter((user) => { return user.email === item.author })[0]}
                marginBottomVal={85} />
        )
    }, [filteredBlogs])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="Results"
                        background={"transparent"} />
                    <ImageView
                        images={[{
                            uri: selectedImage
                        }]}
                        imageIndex={0}
                        visible={isVisible}
                        onRequestClose={handleImageClose}
                    />
                    <View style={[styles.subheadingContainer,
                        // { backgroundColor: theme.colors.background }
                    ]}>
                        <TouchableOpacity
                            onPress={() => {
                                setTab('Blogs')
                            }}>
                            <Text style={[styles.subheading, { color: theme.colors.secondary, fontFamily: tab === 'Blogs' ? 'Inter-Bold' : 'Inter-Medium' }]}>Blogs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setTab('Users')
                            }}>
                            <Text style={[styles.subheading, { color: theme.colors.secondary, fontFamily: tab === 'Users' ? 'Inter-Bold' : 'Inter-Medium' }]}>Users</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.subheading, { fontSize: 20, color: theme.colors.secondary, padding: 10, marginTop: 10 }]}> Results for "{searchTerm}" </Text>
                    {
                        tab === "Blogs" ? (
                            <FlatList
                                data={filteredBlogs}
                                extraData={filteredBlogs}
                                renderItem={renderItem}
                                keyExtractor={item => item._id} />
                        ) : (
                            <FlatList
                                data={filteredUsers}
                                extraData={filteredUsers}
                                renderItem={({ item, index }) => {
                                    return (
                                        <UserCard
                                            user={item}
                                            navigation={navigation} />
                                    )
                                }
                                }
                                keyExtractor={item => item._id} />
                        )
                    }
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subheadingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5,
        height: 30,
        alignItems: 'center'
    },
    subheading: {
        fontFamily: 'Inter-Medium',
        fontSize: 20
    },
})

export default SearchResults;