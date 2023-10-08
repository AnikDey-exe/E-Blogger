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

const userSelector = (context) => [context.user]

function Messages({ navigation }) {
    const { user, signOut } = useAuthenticator(userSelector);
    const users = useSelector(state => state.user.data);

    const [conversations, setConversations] = useState([]);
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        async function getConversationsForUser() {
            const convs = await getConversations(user.attributes.email);
            setConversations(convs);
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
                        }} />
                    <FlatList
                        data={conversations}
                        extraData={conversations}
                        style={{marginTop: 10}}
                        renderItem={({ item, index }) => {
                            const targetUser = users.filter((user) => user.email === item.participantTwo)[0];
                            return (
                                <ConversationCard
                                    name={targetUser.handle}
                                    subheading={"Start chatting!"}
                                    avatar={targetUser.profilePicture}
                                    date={item.lastMessageDate}/>
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