import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import Alert from '../components/ui/Alert';
import MessageInput from '../components/ui/MessageInput';
import Markdown from 'react-native-markdown-package';
import { selectImage } from '../utils';

function BlogDetails({ route, navigation }) {
    const { blogId } = route.params;
    const blog = useSelector(state => state.blog.data.find((item) => item.blogId === blogId));

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader navigation={navigation} text="Post"
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
                                <Text style={[styles.metadata, { color: theme.colors.secondary }]}>{blog.author}</Text>
                                <Text style={[styles.metadata, { color: theme.colors.secondary }]}>{blog.date}</Text>
                            </View>
                            <Markdown styles={markdownStyle.md}>
                                {blog.content}
                            </Markdown>
                            <Text style={styles.sectionHeading}>Comments</Text>
                        </View>
                    </ScrollView>

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
                            }} />
                        <GlobalButton>
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
        marginBottom: 30
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
        height: 70,
        borderTopWidth: 0.5,
        borderStyle: 'solid',
        borderTopColor: '#d6d6d6',
        paddingLeft: 10,
        paddingRight: 10
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
