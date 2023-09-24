import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { updateLikedBlog, updateUnlikedBlog } from '../features/blog/blogSlice';
import { updateFollowUser, updateUnfollowUser } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, unlikeBlog, followUser, unfollowUser } from '../database/services/mutations';
import { Avatar, ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import BottomTab from '../components/layout/BottomTab';
import BlogCard from '../components/ui/BlogCard';
import { PRIMARY_COLOR } from '../constants';

const userSelector = (context) => [context.user]

function UserDetails({ route, navigation }) {
    const { email } = route.params;

    const dispatch = useDispatch();
    const blogs = useSelector(state => state.blog.data.filter((item) => item.author === email));
    const profile = useSelector(state => state.user.data.find((item) => item.email === email));

    const { user, signOut } = useAuthenticator(userSelector);

    const [tab, setTab] = useState('Blogs')
    const [expanded, setExpanded] = useState(true)

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    {email !== user.attributes.email && <AltHeader hasLeftComponent={true} navigation={navigation} text=""
                        background={'transparent'}
                    />}
                    {email === user.attributes.email && <AltHeader navigation={navigation} text="Profile"
                        background={'transparent'} rightComponent={
                            <TouchableOpacity style={{width: 50, height: 50, backgroundColor: 'transparent', alignItems: 'flex-end', justifyContent: 'center'}}
                            onPress={() => { navigation.navigate('SettingsBase') }} >
                                <Icon
                                    name="gear"
                                    type="font-awesome"
                                    color={theme.colors.secondary}
                                    size={25}
                                    onPress={() => { navigation.navigate('SettingsBase') }} 
                                    style={{marginTop: 9}}/>
                            </TouchableOpacity>
                        }
                    />}
                    <View style={styles.mainContainer}>
                        <View style={{ padding: 20 }}>
                            <View>
                                <Avatar
                                    size={100}
                                    rounded
                                    source={{ uri: profile.profilePicture }}
                                    containerStyle={{
                                        borderColor: 'black',
                                        borderWidth: 0.5
                                    }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={[styles.handle, { color: theme.colors.secondary }]}>{profile.handle}</Text>
                                        <Text style={[styles.bio, { color: theme.colors.secondary }]}>{profile.bio}</Text>
                                        <Text style={[styles.followerCount, {}]}>{profile.followers.length} followers</Text>
                                    </View>
                                    {email !== user.attributes.email &&
                                        <GlobalButton
                                            style={{
                                                height: 40,
                                                marginTop: 7.5,
                                                backgroundColor: profile.followers.indexOf(user.attributes.email) >= 0 ? 'transparent' : PRIMARY_COLOR,
                                                borderWidth: 1,
                                                borderColor: PRIMARY_COLOR
                                            }}
                                            onPress={() => {
                                                if (profile.followers.indexOf(user.attributes.email) >= 0) {
                                                    unfollowUser(profile._id, user.attributes.email)
                                                    dispatch(updateUnfollowUser({ id: profile._id, email: user.attributes.email }))
                                                } else {
                                                    followUser(profile._id, user.attributes.email)
                                                    dispatch(updateFollowUser({ id: profile._id, email: user.attributes.email }))
                                                }
                                            }}>
                                            <Text
                                                style={{
                                                    color: profile.followers.indexOf(user.attributes.email) >= 0 ? PRIMARY_COLOR : 'white'
                                                }}>
                                                Follow{profile.followers.indexOf(user.attributes.email) >= 0 ? 'ing' : ''}
                                            </Text>
                                        </GlobalButton>
                                    }
                                </View>
                            </View>
                            <View style={styles.subheadingContainer}>
                                <Text style={[styles.subheading, { color: theme.colors.secondary }]}>Blogs</Text>
                                <Text style={[styles.subheading, { color: theme.colors.secondary }]}>Comments</Text>
                            </View>
                        </View>
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
                                            dispatch(updateLikedBlog({ id: item.blogId, email: user.attributes.email }))
                                        }}
                                        onUnlike={() => {
                                            unlikeBlog(item.blogId, user.attributes.email)
                                            dispatch(updateUnlikedBlog({ id: item.blogId, email: user.attributes.email }))
                                        }}
                                        onImagePressed={() => {

                                        }}
                                        user={profile}
                                        marginBottomVal={"125%"} />
                                )
                            }
                            }
                            keyExtractor={item => item._id} />
                    </View>
                    <BottomTab navigation={navigation} currentTab={email === user.attributes.email ? "UserDetails" : "AnotherUserDetails"} />
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    handle: {
        fontFamily: 'Inter-Bold',
        fontSize: 30,
    },
    bio: {
        fontFamily: 'Inter-Regular',
        fontSize: 17.5
    },
    followerCount: {
        fontFamily: 'Inter-Regular',
        marginTop: 10,
        fontSize: 15,
        color: 'grey'
    },
    mainContainer: {
        // padding: 20
    },
    subheadingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 30
    },
    subheading: {
        fontFamily: 'Inter-Medium',
        fontSize: 20
    }
})

export default UserDetails;