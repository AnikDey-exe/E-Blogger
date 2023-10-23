import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../components/layout/AltHeader';
import GlobalButton from '../components/ui/GlobalButton';
import Alert from '../components/ui/Alert';
import { createId, getCurrentDate } from '../utils';
import { createConversation } from '../database/services/mutations';

const userSelector = (context) => [context.user]

function ChatCreate({ navigation }) {
    const { user, signOut } = useAuthenticator(userSelector);

    const users = useSelector(state => state.user.data);

    const [participant, setParticipant] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [changing, setChanging] = useState(false);
    // const [tags, setTags] = useState([
    //     'helasdo', 
    //     'dsd', 
    //     'sadas', 
    //     'asdpso', 
    //     'sapdkask', 
    //     'sadasdspsp',
    //     'ada'
    // ]);

    async function handleAdd(email) {
        if(email === '') {
            setAlertMessage("This field is empty");
            return;
        }

        if(email === user.attributes.email) {
            setAlertMessage("You cannot create a conversation with yourself");
            return;
        }

        if(users.map(item => item.email).indexOf(email) === -1) {
            setAlertMessage("This user doesn't exist");
            return;
        }

        setAlertMessage("");
        setChanging(true);

        const id = createId();
        let currentDate = getCurrentDate().toString();
        let utcDate = Date.now();

        await createConversation(id, email, user.attributes.email, 'Start chatting with me!', currentDate, utcDate);

        setChanging(false);
        setAlertMessage(`You can now chat with ${email}`);
        setAlertVisible(true);
    }

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: !alertVisible ? theme.colors.background: 'rgba(0, 0, 0, 0.5)'}]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="New Chat"
                        background={'transparent'}
                    />
                    <Alert visible={alertVisible} onClose={()=>{
                        setAlertVisible(false)
                        setAlertMessage('')
                    }} message={alertMessage}/>
                    <View style={styles.mainContainer}>
                        {/* <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
                            {tags.map((item, i) => {
                                return (
                                    <TouchableOpacity 
                                        key={i}
                                        style={{
                                            backgroundColor: 'grey',
                                            borderRadius: 15
                                        }}>
                                        <Text> {item} </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View> */}
                        <Text style={[styles.label, { color: theme.colors.secondary }]}>To</Text>
                        <TextInput
                            placeholder="Email"
                            value={participant}
                            onChangeText={(text) => {
                                setParticipant(text)
                            }}
                            style={styles.input} />
                        {alertMessage && <Text style={[styles.alertText, {color: theme.colors.primary}]}>{alertMessage} </Text>}
                        <GlobalButton 
                            style={{ 
                                borderRadius: 5, 
                                marginTop: 15, 
                                height: 45,
                                opacity: changing ? 0.5 : 1
                            }}
                            onPress={()=>{
                                handleAdd(participant)
                            }}
                            disabled={changing}>
                            <Text style={{ color: 'white', fontFamily: 'Inter-Regular' }}> Create </Text>
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
        width: '90%',
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    label: {
        fontFamily: 'Inter-Medium',
        fontSize: 15
    },
    input: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        fontFamily: 'Inter-Regular'
    },
    alertText: {
        color: 'red',
        fontFamily: 'Inter-Regular'
    }
})

export default ChatCreate;