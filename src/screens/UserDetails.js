import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    SectionList
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { updateLikedBlog, updateUnlikedBlog } from '../features/blog/blogSlice';
import { updateFollowUser, updateUnfollowUser } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, unlikeBlog, followUser, unfollowUser } from '../database/services/mutations';
import { getUserComments } from '../database/services/queries';
import { Avatar, ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import BottomTab from '../components/layout/BottomTab';
import BlogCard from '../components/ui/BlogCard';
import MessageCard from '../components/ui/MessageCard';
import { PRIMARY_COLOR } from '../constants';
import { createId, getCurrentDate } from '../utils';
import ImageView from 'react-native-image-viewing';

const userSelector = (context) => [context.user]

function UserDetails({ route, navigation }) {
    const { email } = route.params;

    const dispatch = useDispatch();
    const blogs = useSelector(state => state.blog.data.filter((item) => item.author === email));
    const profile = useSelector(state => state.user.data.find((item) => item.email === email));

    const { user, signOut } = useAuthenticator(userSelector);
    const ownProfile = useSelector(state => state.user.data.find((item) => item.email === user.attributes.email));

    const [tab, setTab] = useState('Blogs');
    const [expanded, setExpanded] = useState(true);

    const [messages, setMessages] = useState([]);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const scrollOffsetY = useRef(new Animated.Value(0)).current;

    const animatedHeaderHeight = scrollOffsetY.interpolate({
        inputRange: [0, 225],
        outputRange: [225, 0],
        extrapolate: 'clamp'
    })

    const animatedSubheaderHeight = scrollOffsetY.interpolate({
        inputRange: [0, 100],
        outputRange: [100, 0],
        extrapolate: 'clamp'
    })

    useEffect(() => {
        async function fetchComments() {
            const comments = await getUserComments(profile.email)
            setMessages(comments.filter((item, i) => { return item._id.indexOf("convo") === -1 }));
        }
        fetchComments();
    }, [])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    {email !== user.attributes.email && <AltHeader hasLeftComponent={true} navigation={navigation} text=""
                        background={'transparent'}
                    />}
                    {email === user.attributes.email && <AltHeader navigation={navigation} text="Profile"
                        background={'transparent'} rightComponent={
                            <TouchableOpacity style={{ width: 50, height: 50, backgroundColor: 'transparent', alignItems: 'flex-end', justifyContent: 'center' }}
                                onPress={() => { navigation.navigate('SettingsBase') }} >
                                <Icon
                                    name="gear"
                                    type="font-awesome"
                                    color={theme.colors.secondary}
                                    size={25}
                                    onPress={() => { navigation.navigate('SettingsBase') }}
                                    style={{ marginTop: 9 }} />
                            </TouchableOpacity>
                        }
                    />}
                    <ImageView
                        images={[{
                            uri: selectedImage
                        }]}
                        imageIndex={0}
                        visible={isVisible}
                        onRequestClose={() => setIsVisible(false)}
                    />
                    <View style={styles.mainContainer}>
                        <View style={{ padding: 20 }}>
                            <Animated.View style={{
                                height: animatedHeaderHeight,
                                overflow: 'hidden'
                            }}>
                                <Avatar
                                    size={100}
                                    rounded
                                    source={{ uri: profile.profilePicture }}
                                    containerStyle={{
                                        borderColor: 'black',
                                        borderWidth: 0.5,
                                        zIndex: -2,
                                    }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={[styles.handle, { color: theme.colors.secondary }]}>{profile.handle}</Text>
                                        <Text style={[styles.bio, { color: theme.colors.secondary }]}>{profile.bio}</Text>
                                        <Text style={[styles.followerCount, {}]}>{profile.followers.length} followers</Text>
                                    </View>
                                    {((profile.accountVisibility.toLowerCase() === "public"
                                        || (profile.accountVisibility.toLowerCase() === "followers only" && profile.followers.indexOf(user.attributes.email) >= 0))
                                        && email !== user.attributes.email) &&
                                        <GlobalButton
                                            style={{
                                                height: 40,
                                                marginTop: 7.5,
                                                backgroundColor: profile.followers.indexOf(user.attributes.email) >= 0 ? 'transparent' : PRIMARY_COLOR,
                                                borderWidth: 1,
                                                borderColor: PRIMARY_COLOR
                                            }}
                                            onPress={() => {
                                                navigation.navigate('ChatCreate', {
                                                    email: email
                                                })
                                            }}>
                                            <Text
                                                style={{
                                                    color: profile.followers.indexOf(user.attributes.email) >= 0 ? PRIMARY_COLOR : 'white'
                                                }}>
                                                Message
                                            </Text>
                                        </GlobalButton>
                                    }
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
                                                    followUser(profile._id, user.attributes.email, createId(), getCurrentDate().toString(), Date.now(), ownProfile.handle, profile.email)
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
                            </Animated.View>
                            {(profile.accountVisibility.toLowerCase() === "public"
                                || (profile.accountVisibility.toLowerCase() === "followers only" && profile.followers.indexOf(user.attributes.email) >= 0)
                                || profile.email === user.attributes.email) &&
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
                                            setTab('Comments')
                                        }}>
                                        <Text style={[styles.subheading, { color: theme.colors.secondary, fontFamily: tab === 'Comments' ? 'Inter-Bold' : 'Inter-Medium' }]}>Comments</Text>
                                    </TouchableOpacity>
                                    {profile.email === user.attributes.email &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTab('Saved')
                                            }}>
                                            <Text style={[styles.subheading, { color: theme.colors.secondary, fontFamily: tab === 'Saved' ? 'Inter-Bold' : 'Inter-Medium' }]}>Saved</Text>
                                        </TouchableOpacity>
                                    }
                                </View>}
                        </View>
                        {(profile.accountVisibility.toLowerCase() === "public"
                            || (profile.accountVisibility.toLowerCase() === "followers only" && profile.followers.indexOf(user.attributes.email) >= 0)
                            || profile.email === user.attributes.email) ? (
                            <>
                                {tab === 'Blogs' &&
                                    <FlatList
                                        data={blogs.filter((item) => { return item.status === "published" })}
                                        extraData={blogs.filter((item) => { return item.status === "published" })}
                                        style={{
                                            backgroundColor: theme.colors.background
                                        }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <BlogCard
                                                    item={item}
                                                    navigation={navigation}
                                                    isLastItem={index === blogs.filter((item) => { return item.status === "published" }).length - 1}
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
                                                        setSelectedImage(item.thumbnail);
                                                        setIsVisible(true);
                                                    }}
                                                    user={profile}
                                                    marginBottomVal={"125%"} />
                                            )
                                        }}
                                        scrollEventThrottle={16}
                                        onScroll={Animated.event(
                                            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                                            { useNativeDriver: false }
                                        )}
                                        keyExtractor={item => item._id} />
                                }

                                {tab === 'Comments' &&
                                    <FlatList
                                        data={messages}
                                        extraData={messages}
                                        style={{ padding: 20, backgroundColor: theme.colors.background }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <MessageCard
                                                    item={item}
                                                    email={user.attributes.email}
                                                    user={{handle: profile.handle}}
                                                    isLiked={item?.likedBy.indexOf(user.attributes.email) >= 0 ? true : false}
                                                    absoluteDate={ownProfile.dateOption === 'absolute'}
                                                    isLastItem={index === messages.length - 1}
                                                    marginBottomVal={"200%"} />
                                            )
                                        }}
                                        keyExtractor={item => item._id} />
                                }

                                {tab === 'Saved' &&
                                    <FlatList
                                        data={blogs.filter((item) => { return item.status === "saved" })}
                                        extraData={blogs.filter((item) => { return item.status === "saved" })}
                                        style={{
                                            backgroundColor: theme.colors.background
                                        }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <BlogCard
                                                    item={item}
                                                    navigation={navigation}
                                                    isLastItem={index === blogs.filter((item) => { return item.status === "saved" }).length - 1}
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
                                                        setSelectedImage(item.thumbnail);
                                                        setIsVisible(true);
                                                    }}
                                                    user={profile}
                                                    marginBottomVal={"125%"} />
                                            )
                                        }}
                                        scrollEventThrottle={16}
                                        onScroll={Animated.event(
                                            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                                            { useNativeDriver: false }
                                        )}
                                        keyExtractor={item => item._id} />
                                }
                            </>
                        ) : (
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                // borderColor: 'black',
                                // borderWidth: 1,
                                marginTop: '15%'
                            }}>
                                <Text style={[styles.privateText, { color: theme.colors.secondary }]}>This account is private</Text>
                                <Text style={[styles.privateText, { color: 'grey', fontFamily: 'Poppins-Regular', fontSize: 15, paddingLeft: '10%', paddingRight: '10%', textAlign: 'center' }]}>This user's visibility is set to private or followers only</Text>
                            </View>
                        )}
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
        marginTop: 5,
        height: 30,
        alignItems: 'center'
    },
    subheading: {
        fontFamily: 'Inter-Medium',
        fontSize: 20
    },
    privateText: {
        alignSelf: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 17.5
    }
})

export default UserDetails;