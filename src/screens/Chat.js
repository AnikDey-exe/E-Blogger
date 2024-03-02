import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import Realm from "realm";
import { ConversationSchema, CommentsSchema } from '../database/schemas';
import { DB_APP_ID, OPENAI_API_KEY } from "@env";
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import MessageInput from '../components/ui/MessageInput';
import Alert from '../components/ui/Alert';
import { selectImage, uploadImage, getImage, getCurrentDate, createId } from '../utils';
import { addComment } from '../database/services/mutations';
import { current } from '@reduxjs/toolkit';

const userSelector = (context) => [context.user]

function Chat({ route, navigation }) {
    const { avatar, conversationId, name, type } = route.params;

    const { user, signOut } = useAuthenticator(userSelector);

    const dbUser = useRef(null);
    const fetchInterval = useRef(null);
    const flatlistRef = useRef(null);

    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        async function getMessages() {
            if (type !== 'ai') {
                const app = new Realm.App({
                    id: DB_APP_ID,
                    timeout: 2000
                });

                const credentials = Realm.Credentials.anonymous();
                let user2;
                let realm;

                try {
                    user2 = await app.logIn(credentials);
                    dbUser.current = user2;

                    realm = await Realm.open({
                        schema: [CommentsSchema, ConversationSchema],
                        sync: {
                            user: user2,
                            flexible: true
                        },
                    });

                    await realm.subscriptions.update((subs) => {
                        const comments = realm
                            .objects("Comments")
                        const conversation = realm
                            .objects("Conversation");
                        subs.add(comments);
                        subs.add(conversation);
                    });
                    console.log("subscribeds")
                } catch (err) {
                    console.error("Failed to log in", err);
                }
                const interval = setInterval(() => {
                    const blogComments = realm.objects("Comments").filtered(`commentId='${conversationId.substring(0, 6)}'`);
                    setMessages(blogComments);
                }, 2000);
                fetchInterval.current = interval;
            } else {
                setMessages(prevMessages => [...prevMessages, {
                    id: createId(),
                    author: 'ai',
                    message: 'Hey there how can I help you?',
                    image: '',
                    date: ''
                }])
            }
        }
        getMessages();
        return () => {
            if (type !== 'ai') {
                dbUser.current.logOut();
                clearInterval(fetchInterval.current);
            }
        }
    }, [])

    async function handleAdd(message, author, imageToUpload) {
        if (type !== 'ai') {
            const id = createId();
            let image = '';
            let currentDate = getCurrentDate().toString();
            let utcDate = Date.now();

            if (selectedImage) {
                await uploadImage(`comment/${id}`, imageToUpload);
                image = await getImage(`comment/${id}`);
            }

            let realm;

            try {
                realm = await Realm.open({
                    schema: [CommentsSchema, ConversationSchema],
                    sync: {
                        user: dbUser.current,
                        flexible: true
                    },
                });

                await realm.subscriptions.update((subs) => {
                    const comments = realm
                        .objects("Comments")
                    const conversation = realm
                        .objects("Conversation");
                    subs.add(comments);
                    subs.add(conversation);
                });
                console.log("subscribeds")
            } catch (err) {
                console.error("Failed to log in", err);
            }

            let item;
            realm.write(() => {
                const conv1 = realm.objects("Conversation").filtered(`_id='${conversationId}'`)[0]
                const conv2 = realm.objects("Conversation").filtered(`_id='${conversationId.endsWith("2") ? conversationId.slice(0, conversationId.length - 1) : conversationId + '2'}'`)[0]
                conv1.lastMessage = message
                conv1.lastMessageDate = currentDate
                conv1.lastMessageUtcDate = utcDate
                conv2.lastMessage = message
                conv2.lastMessageDate = currentDate
                conv2.lastMessageUtcDate = utcDate
                item = realm.create('Comments', {
                    _id: id+"convo",
                    author: author,
                    commentId: conversationId.substring(0, 6),
                    date: currentDate,
                    image: image,
                    likedBy: [],
                    message: message,
                    utcDate: utcDate
                })
                console.log('Created.')
            })
        } else {
            setMessages(prevMessages => [...prevMessages, {
                id: createId(),
                author: author,
                message: message,
                image: '',
                date: ''
            }])
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{
                        "role": "system",
                        "content": "You are a blog chatbot that helps users with blog and social media related stuff."
                    }, {
                        "role": "user",
                        "content": message
                    }]
                })
            }).then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                setMessages(prevMessages => [...prevMessages, {
                    id: createId(),
                    author: 'ai',
                    message: data.choices[0].message.content,
                    image: '',
                    date: ''
                }])
            }).catch(error => {
                console.error('Error:', error);
            });
            setMessage('')
        }
    }

    const renderItem = ({ item, index }) =>
        <ChatBubble
            left={item.author !== user.attributes.email}
            image={item.image}
            message={item.message}
            date={item.date} />

    const keyExtractor = item => item._id;

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <ChatHeader
                        navigation={navigation}
                        text={name}
                        avatar={avatar}
                        background={"transparent"} />
                    <FlatList
                        ref={flatlistRef}
                        data={messages}
                        //removeClippedSubviews={true}
                        // inverted
                        initialNumToRender={10}
                        windowSize={10}
                        // contentContainerStyle={{ flexDirection: 'column-reverse' }}
                        onContentSizeChange={() => {
                            if (flatlistRef.current && flatlistRef.current.scrollToIndex && messages && messages.length) {
                                flatlistRef.current.scrollToIndex({  index: messages.length - 1 });
                            }
                        }}
                        onScrollToIndexFailed={() => {}}
                        extraData={messages}
                        style={{ marginBottom: 100, scaleY: -1 }}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor} />
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
                            }} />
                        <GlobalButton onPress={() => {
                            handleAdd(message, user.attributes.email, selectedImage)
                        }}>
                            <Icon
                                name="send"
                                type="feather"
                                color={theme.colors.background} />
                        </GlobalButton>
                    </View>
                </View>
            )}
        </ThemeConsumer>
    )
}

function ChatHeader({ navigation, text, avatar, background }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.chatHeader, { backgroundColor: background }]}>
                    <TouchableOpacity
                        style={{ width: 40, height: 50, backgroundColor: 'transparent', alignItems: 'flex-start', justifyContent: 'center' }}
                        onPress={() => { navigation.goBack() }}>
                        <Icon
                            name="left"
                            type="antdesign"
                            color={theme.colors.secondary}
                            onPress={() => { navigation.goBack() }}
                            size={17.5} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 0, flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar
                            size={35}
                            rounded
                            source={{
                                uri: avatar
                            }}
                            containerStyle={{
                                borderColor: 'black',
                                borderWidth: 0.5,
                            }} />
                        <Text style={[styles.chatHeaderText, { color: theme.colors.secondary }]}>{text}</Text>
                    </View>
                </View>
            )}
        </ThemeConsumer>
    )
}

function ChatBubble({ message, date, left, image }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.chatBubbleContainer, {
                    backgroundColor: left ? '#9da0a6' : '#1982fc',
                    alignSelf: left ? 'flex-start' : 'flex-end'
                }]}>
                    <Text style={{ color: 'white', fontFamily: 'Inter-Regular', textAlign: left ? 'left' : 'right' }}>{message}</Text>
                    {image
                        && <Image
                            source={{
                                uri: image
                            }}
                            style={styles.image} />
                    }
                    {date && <Text style={{ color: 'white', fontFamily: 'Inter-Regular', textAlign: left ? 'left' : 'right', fontSize: 10 }}>{date}</Text>}
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bottomMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 70,
        borderTopWidth: 0.5,
        borderStyle: 'solid',
        borderTopColor: '#d6d6d6',
        paddingLeft: 10,
        paddingRight: 10,
        position: 'absolute',
        bottom: 0
    },
    chatHeader: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        marginTop: 20
    },
    chatHeaderText: {
        fontFamily: 'Inter-Medium',
        fontSize: 17.5,
        marginLeft: 10
    },
    chatBubbleContainer: {
        maxWidth: '65%',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 15,
        padding: 10,
        scaleY: -1
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        marginTop: 5
    },
});

export default Chat;