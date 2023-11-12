import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import Header from '../components/layout/Header';
import BottomTab from '../components/layout/BottomTab';
import NotificationCard from '../components/ui/NotificationCard';
import { getNotifications } from '../database/services/queries';
import { deleteNotification } from '../database/services/mutations';

const userSelector = (context) => [context.user]

function Notifications({ navigation }) {
    const { user, signOut } = useAuthenticator(userSelector);

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function getNotifs() {
            const notifs = await getNotifications(user.attributes.email);
            setNotifications(notifs);
        }
        getNotifs();
    }, [])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <Header
                        navigation={navigation}
                        text="Notifications"
                    />
                    <FlatList
                        data={notifications}
                        extraData={notifications}
                        style={{ marginTop: 10 }}
                        renderItem={({ item, index }) => {
                            return (
                                <NotificationCard
                                    message={item.message}
                                    date={item.date}
                                    onDelete={async () => {
                                        await deleteNotification(item._id)
                                        setNotifications(prevNotifications => prevNotifications.filter((noti) => { return noti._id != item._id }))
                                    }} />
                            )
                        }}
                        keyExtractor={item => item._id} />
                    <BottomTab navigation={navigation} currentTab="Notifications" />
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

export default Notifications;