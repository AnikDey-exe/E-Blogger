import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeConsumer, useThemeMode } from '@rneui/themed';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import Alert from '../components/ui/Alert';
import Markdown from 'react-native-markdown-package';

function BlogDetails({ route, navigation }) {
    const { blogId } = route.params;
    const blog = useSelector(state => state.blog.data.find((item) => item.blogId === blogId));

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader navigation={navigation} text=""
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
                            <Markdown styles={markdownStyle.md}>
                                {blog.content}
                            </Markdown>
                        </View>
                    </ScrollView>
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
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 35,
        marginBottom: 2.5,
    },
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
