import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    Image,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import Header from '../components/layout/Header';
import BottomTab from '../components/layout/BottomTab';
import SearchBar from '../components/ui/SearchBar';
import ConversationCard from '../components/ui/ConversationCard';
import { getConversations } from '../database/services/queries';
import { search } from '../utils';

const userSelector = (context) => [context.user]

function Messages({ navigation }) {
    const { user, signOut } = useAuthenticator(userSelector);
    const users = useSelector(state => state.user.data);

    const [conversations, setConversations] = useState([]);
    const [results, setResults] = useState([]);
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        async function getConversationsForUser() {
            const convs = await getConversations(user.attributes.email);
            setConversations(convs);
            setResults(convs);
        }
        getConversationsForUser();
    }, [])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <Header
                        navigation={navigation}
                        text="Chat"
                        rightComponent={
                            <Icon
                                name="new-message"
                                type="entypo"
                                color={theme.colors.primary}
                                onPress={() => {
                                    navigation.navigate('ChatCreate');
                                }} />
                        }
                    />
                    <SearchBar
                        value={searchVal}
                        onChangeText={(text) => {
                            setSearchVal(text)
                            setResults(search(conversations, text))
                        }} />
                    <FlatList
                        data={[{_id: 'ai2981', participantTwo: 'Assistant', subheading: 'Chat With Me'},...results]}
                        extraData={[{_id: 'ai2981', participantTwo: 'Assistant', subheading: 'Chat With Me'},...results]}
                        style={{marginTop: 10}}
                        renderItem={({ item, index }) => {
                            const targetUser = index !== 0 ? users.filter((user) => user.email === item.participantTwo)[0] : '';
                            return (
                                <ConversationCard
                                    name={item.participantTwo.split('@')[0]}
                                    altName={index === 0 ? '' : targetUser.handle}
                                    subheading={index === 0 ? 'Chat with me!' : item.lastMessage}
                                    avatar={index === 0 ? 'https://images.vexels.com/media/users/3/129538/isolated/preview/11620f8f156f35ff8e4bf81d9dad3e58-man-head-cartoon-design.png' : targetUser.profilePicture}
                                    date={index === 0 ? '' : item.lastMessageDate}
                                    onPress={()=>{
                                        navigation.navigate('Chat', {
                                            avatar: index === 0 ? 'https://images.vexels.com/media/users/3/129538/isolated/preview/11620f8f156f35ff8e4bf81d9dad3e58-man-head-cartoon-design.png' : targetUser.profilePicture,
                                            conversationId: item._id,
                                            name: index === 0 ? 'Assistant' : targetUser.handle,
                                            type: index === 0 ? 'ai' : 'user'
                                        })
                                    }}/>
                            )
                        }}
                        keyExtractor={item => item._id} />
                    <BottomTab navigation={navigation} currentTab="Messages" />

                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default Messages;