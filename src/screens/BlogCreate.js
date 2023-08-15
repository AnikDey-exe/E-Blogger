import React, { useState, useRef } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native';
import { ThemeConsumer, useThemeMode } from '@rneui/themed';
import { PRIMARY_COLOR } from '../constants';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import storage from '@react-native-firebase/storage';
import Realm from 'realm';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import Alert from '../components/ui/Alert';
import Markdown from 'react-native-markdown-package';
import { selectImage, uploadImage, getImage, createId, getCurrentDate } from '../utils';
import { createBlog } from '../database/services/mutations';

const markdownFeatures = [
    {
        text: 'B',
        feature: '** **',
        style: {
            fontFamily: 'Poppins-Bold'
        },
    },
    {
        text: 'I',
        feature: '_ _',
        style: {
            fontFamily: 'Poppins-BlackItalic'
        }
    },
    {
        text: 'H1',
        feature: '#',
        style: {
            fontFamily: 'Poppins-Regular',
            marginTop: 1.5
        }
    },
    {
        text: 'H2',
        feature: '##',
        style: {
            fontFamily: 'Poppins-Regular',
            marginTop: 1.5
        }
    },
    {
        text: 'S̶',
        feature: '~~ ~~',
        style: {
            fontFamily: 'Poppins-Regular',
            marginTop: 1.5,
            marginLeft: -5
        }
    }
]
const userSelector = (context) => [context.user]

function BlogCreate({ navigation }) {
    const [title, setTitle] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const { mode, setMode } = useThemeMode();
    const { user, signOut } = useAuthenticator(userSelector);
    const markdownInputRef = useRef();

    async function handleAdd(title, hashtag, content, author, status, imageToUpload) {
        const id = createId();
        let thumbnail = '';
        let date = getCurrentDate().toString();
        if(selectedImage) {
            await uploadImage(`blog/${id}`, imageToUpload);
            thumbnail = await getImage(`blog/${id}`);
        }
        await createBlog(title, hashtag, content, author, status, thumbnail, date, [], id)
    }

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: !alertVisible ? theme.colors.background: 'rgba(0, 0, 0, 0.5)'}]}>
                    <AltHeader navigation={navigation} text="Create" 
                    background={'transparent'}
                    />
                    <Alert visible={alertVisible} onClose={()=>{
                        setAlertVisible(false)
                    }}/>

                    {/* user inputs for title, hashtag, and markdown */}
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.mainContainer}>
                            <TextInput
                                placeholder="Title"
                                multiline={true}
                                maxLength={75}
                                placeholderTextColor="grey"
                                style={[styles.titleInput, { color: theme.colors.secondary }]}
                                value={title}
                                onChangeText={(text) => {
                                    setTitle(text)
                                }}
                            />
                            <TextInput
                                placeholder="#hashtag"
                                placeholderTextColor="grey"
                                style={[styles.titleInput, { color: theme.colors.secondary, fontSize: 15, marginTop: -15 }]}
                                value={hashtag}
                                onChangeText={(text) => {
                                    setHashtag(text)
                                }}
                            />

                            {/* markdown section */}
                            <MarkdownInput
                                ref={markdownInputRef}
                                value={content}
                                onChangeText={(text) => {
                                    setContent(text)
                                }}
                                onPressButton={() => {
                                    setContent(prevContent => prevContent + '** **')
                                }}
                                features={markdownFeatures}
                                style={{ color: theme.colors.secondary }}
                                placeholderTextColor={theme.colors.secondary} />
                            <Text style={[styles.secondaryHeader, { color: theme.colors.secondary }]}>Preview</Text>
                            <Markdown styles={markdownStyle.md}>
                                {content}
                            </Markdown>
                        </View>
                    </ScrollView>

                    {/* bottom menu */}
                    <View style={[styles.bottomMenu, { backgroundColor: 'transparent' }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <GlobalButton
                                style={{ backgroundColor: PRIMARY_COLOR }}
                                onPress={() => {
                                    selectImage(function (res) {
                                        if (!res.error) {
                                            setSelectedImage(res.source)
                                        }
                                    })
                                }}>
                                <Text style={{ color: 'white', fontFamily: 'Inter-Bold' }}>Upload Image</Text>
                            </GlobalButton>
                            {selectedImage && <Text style={{
                                alignSelf: 'center',
                                color: theme.colors.secondary,
                                marginLeft: 10
                            }}> Selected! </Text>}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <GlobalButton style={{ backgroundColor: 'transparent', marginRight: 7.5 }} 
                                // onPress={()=>{
                                //     setMode('dark')
                                // }}
                            >
                                <Text style={{ color: theme.colors.primary, fontFamily: 'Inter-Bold' }}>Save</Text>
                            </GlobalButton>
                            <GlobalButton style={{ backgroundColor: PRIMARY_COLOR }} onPress={()=>{
                                handleAdd(title, hashtag, content, user.attributes.email, 'published', selectedImage)
                            }}>
                                <Text style={{ color: 'white', fontFamily: 'Inter-Bold' }}>Publish</Text>
                            </GlobalButton>
                        </View>
                    </View>
                </View>
            )}
        </ThemeConsumer>
    )
}

const MarkdownInput = React.forwardRef(({ value, onChangeText, features, style = {}, placeholderTextColor }, ref) => {
    const [inputPos, setInputPos] = useState(0)
    return (
        <>
            <View style={styles.markdownButtonContainer}>
                {features.map((item, i) => {
                    return (
                        <MarkdownButton
                            key={i}
                            text={item.text}
                            onPress={() => {
                                onChangeText(prevText => prevText.slice(0, inputPos) + item.feature + prevText.slice(inputPos))
                                ref.current.focus()
                            }}
                            textStyle={{ ...item.style, color: placeholderTextColor }} />
                    )
                })}
            </View>
            <TextInput
                placeholder="Your text"
                placeholderTextColor={placeholderTextColor}
                style={[styles.markdownInput, { ...style }]}
                multiline={true}
                value={value}
                onChangeText={onChangeText}
                blurOnSubmit={false}
                ref={ref}
                onSelectionChange={(event) => {
                    setInputPos(event.nativeEvent.selection.start)
                }}
            />
        </>
    )
})

function MarkdownButton({ text, onPress, textStyle = {} }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.markdownButton}>
            <Text style={[styles.markdownText, { ...textStyle }]}> {text} </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        padding: 20
    },
    titleInput: {
        fontSize: 30,
        fontFamily: 'Inter-Bold'
    },
    markdownInput: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        height: 250,
        textAlignVertical: 'top'
    },
    markdownButtonContainer: {
        flexDirection: 'row'
    },
    markdownButton: {
        height: 30,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginRight: 10
    },
    markdownText: {
        fontSize: 20
    },
    secondaryHeader: {
        fontSize: 25,
        fontFamily: 'Inter-Bold'
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
        paddingLeft: 20,
        paddingRight: 20
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
            textAlignVertical: 'top'
        },
        strong: {
            textAlign: 'left'
        }
    }
}

export default BlogCreate;