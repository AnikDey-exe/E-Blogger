import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateLikedBlog, updateUnlikedBlog } from '../features/blog/blogSlice';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import Alert from '../components/ui/Alert';
import MessageInput from '../components/ui/MessageInput';
import MessageCard from '../components/ui/MessageCard';
import Markdown from 'react-native-markdown-package';
import { selectImage, createId, getCurrentDate, uploadImage, getImage } from '../utils';
import { likeBlog, unlikeBlog, addComment, createNotification } from '../database/services/mutations';
import { getComments } from '../database/services/queries';

const userSelector = (context) => [context.user]

function BlogDetails({ route, navigation }) {
    const { blogId, handle } = route.params;
    const dispatch = useDispatch();
    const blog = useSelector(state => state.blog.data.find((item) => item.blogId === blogId));

    const { user, signOut } = useAuthenticator(userSelector);
    const users = useSelector(state => state.user.data)
    const profile = useSelector(state => state.user.data.find((item) => item.email === user.attributes.email));

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const [inputHeight, setInputHeight] = useState(50);
    const [loading, setLoading] = useState(false);

    async function handleAdd(message, author, imageToUpload) {
        setLoading(true);
        const id = createId();
        const notificationId = createId();
        let image = '';
        let currentDate = getCurrentDate().toString();
        let utcDate = Date.now()

        if (selectedImage) {
            await uploadImage(`comment/${id}`, imageToUpload);
            image = await getImage(`comment/${id}`);
        }

        await addComment(id, blog.blogId, author, currentDate, image, [], message, utcDate, notificationId, blog.author, profile.handle);
        setMessages(prevMessages => [...prevMessages, {
            _id: id,
            author: author,
            commentId: blog.blogId,
            date: currentDate,
            image: image,
            likedBy: [],
            message: message,
            utcDate: utcDate
        }])
        setMessage('');
        setSelectedImage('');
        setLoading(false);
    }

    useEffect(() => {
        async function fetchComments() {
            const comments = await getComments(blog.blogId);
            setMessages(comments);
        }
        fetchComments();
    }, [])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="Post"
                        background={'transparent'}
                    />
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.mainContainer}>
                            <Text style={[styles.title, { color: theme.colors.secondary }]}>{blog.title}</Text>
                            <Image
                                source={{ uri: blog.thumbnail }}
                                style={{
                                    width: '100%',
                                    aspectRatio: 1,
                                    marginBottom: 20,
                                    marginTop: 20
                                }} />

                            {/* blog metadata */}
                            <View style={styles.blogMetadataContainer}>
                                <Text style={[styles.metadata, { color: theme.colors.secondary }]}>{handle}</Text>
                                <Text style={[styles.metadata, { color: theme.colors.secondary }]}>{blog.date}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
                                <Icon
                                    name={blog.likedBy.indexOf(user.attributes.email) >= 0 ? "heart" : "hearto"}
                                    color={blog.likedBy.indexOf(user.attributes.email) >= 0 ? "red" : theme.colors.secondary}
                                    type="antdesign"
                                    style={styles.heartIcon}
                                    onPress={() => {
                                        if (blog.likedBy.indexOf(user.attributes.email) >= 0) {
                                            unlikeBlog(blog.blogId, user.attributes.email)
                                            dispatch(updateUnlikedBlog({ id: blog.blogId, email: user.attributes.email }))
                                        } else {
                                            likeBlog(blog.blogId, user.attributes.email)
                                            dispatch(updateLikedBlog({ id: blog.blogId, email: user.attributes.email }))
                                        }
                                    }}
                                />
                                <Text style={[styles.metric, { color: theme.colors.secondary }]}>{blog.likedBy.length}</Text>
                            </View>
                            <Markdown styles={markdownStyle.md}>
                                {blog.content}
                            </Markdown>
                            <Text style={styles.sectionHeading}>Comments</Text>
                            <FlatList
                                data={messages}
                                extraData={messages}
                                renderItem={({ item, index }) => {
                                    return (
                                        <MessageCard
                                            item={item}
                                            email={user.attributes.email}
                                            user={users.filter((userP) => { return userP.email === user.attributes.email })[0]}
                                            isLiked={item?.likedBy.indexOf(user.attributes.email) >= 0 ? true : false}
                                            absoluteDate={profile.dateOption === 'absolute'} />
                                    )
                                }}
                                keyExtractor={item => item._id} />
                        </View>
                    </ScrollView>
                    <View>
                        {selectedImage &&
                            <View style={{
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 10
                            }}>
                                <Text style={{
                                    color: theme.colors.secondary,
                                    marginLeft: 10
                                }}> Selected! </Text>
                                <GlobalButton
                                    onPress={() => {
                                        setSelectedImage('')
                                    }}
                                    style={{
                                        marginRight: 10
                                    }}>
                                    <Text style={{ color: 'white', fontFamily: 'Inter-Bold' }}> Cancel </Text>
                                </GlobalButton>
                            </View>
                        }
                        {/* bottom menu */}
                        <View style={[styles.bottomMenu, { backgroundColor: 'transparent' }]}>
                            <GlobalButton
                                onPress={() => {
                                    selectImage(function (res) {
                                        if (!res.error) {
                                            setSelectedImage(res.source)
                                        }
                                    })
                                }}>
                                <Icon
                                    name="folder-images"
                                    type="entypo"
                                    color={theme.colors.background} />
                            </GlobalButton>
                            <MessageInput
                                value={message}
                                onChangeText={(text) => {
                                    setMessage(text)
                                }}
                                onFocus={() => {
                                    setInputHeight(100)
                                }}
                                onBlur={() => {
                                    setInputHeight(50)
                                }}
                                style={{
                                    height: inputHeight
                                }} />
                            <GlobalButton onPress={() => {
                                handleAdd(message, user.attributes.email, selectedImage)
                            }}>
                                {loading ?
                                    <ActivityIndicator size="small" color="white" /> :
                                    <Icon
                                        name="send"
                                        type="feather"
                                        color={theme.colors.background} />
                                }
                            </GlobalButton>
                        </View>
                    </View>
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        padding: 20
    },
    blogMetadataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 32.5,
        marginBottom: 2.5,
        marginTop: -15
    },
    metadata: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        color: 'black'
    },
    sectionHeading: {
        fontFamily: 'Poppins-SemiBold',
        color: 'black',
        fontSize: 20,
        marginTop: 30
    },
    bottomMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 'fit-content',
        borderTopWidth: 0.5,
        borderStyle: 'solid',
        borderTopColor: '#d6d6d6',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    heartIcon: {
        alignSelf: 'flex-start',
    },
    metric: {
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
        marginTop: 5,
        marginLeft: 10
    }
})

const markdownStyle = {
    md: {
        text: {
            color: 'black',
            textAlign: "left",
            alignItems: 'flex-start'
        },
        view: {
            width: '100%',
            textAlignVertical: 'top',
        },
        strong: {
            textAlign: 'left'
        }
    }
}

export default BlogDetails;
