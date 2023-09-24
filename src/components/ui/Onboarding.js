import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet, TextInput, Image } from 'react-native';
import GlobalButton from './GlobalButton';
import { PRIMARY_COLOR } from '../../constants';
import { registerUser } from '../../database/services/mutations';
import { createId } from '../../utils';

export default function Onboarding({ visible, onClose, email }) {
    const [handle, setHandle] = useState('');
    const [bio, setBio] = useState('');

    async function handleRegister(handle, bio) {
        const id = createId();
        await registerUser(id, 'private', bio, 'relative', email, [], handle, 'https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg')
        onClose()
    }

    return (
        <Modal
            presentationStyle='overFullScreen'
            animationType="slide"
            transparent={false}
            visible={visible}>
            <View style={styles.centerView}>
                <Image
                    source={require('../../../assets/images/userp.jpg')}
                    style={{
                        width: '60%',
                        height: 'auto',
                        aspectRatio: 1,
                        alignSelf: 'center',
                        marginRight: '7.5%',
                        marginTop: -35
                    }} />
                <Text style={styles.title}>Setup Profile </Text>
                <OnboardingInput
                    placeholder="Name"
                    value={handle}
                    multiline={false}
                    onChangeText={(text) => {
                        setHandle(text)
                    }} />
                <OnboardingInput
                    placeholder="About Me"
                    style={{
                        // paddingBottom: 50,
                        height: '25%',
                        textAlignVertical: 'top',
                        paddingTop: 15
                    }}
                    multiline={true}
                    value={bio}
                    onChangeText={(text) => {
                        setBio(text)
                    }} />
                <GlobalButton style={styles.registerButton} onPress={()=>{
                    handleRegister(handle, bio)
                }}>
                    <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 15 }}> Finish </Text>
                </GlobalButton>
            </View>
        </Modal>
    )
}

function OnboardingInput({ value, placeholder, onChangeText, multiline, style = {} }) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="grey"
            value={value}
            onChangeText={onChangeText}
            style={[styles.input, { ...style }]}
            multiline={multiline} />
    )
}

const styles = StyleSheet.create({
    centerView: {
        flex: 1,
        // padding: 15,
        paddingLeft: '7.5%',
        justifyContent: 'center',
        // backgroundColor: 'white'
        // alignItems: 'center',
        // alignSelf: 'center'
    },
    registerButton: {
        backgroundColor: PRIMARY_COLOR,
        width: '92.5%',
        marginTop: 20,
        borderRadius: 5,
        height: 60
    },
    title: {
        fontFamily: 'Inter-Bold',
        color: 'black',
        fontSize: 25,
        marginTop: 40
    },
    input: {
        borderWidth: 1,
        borderColor: '#bfbfbf',
        backgroundColor: '#f7f7f7',
        width: '92.5%',
        paddingLeft: 10,
        fontFamily: 'Inter-Regular',
        marginTop: 12.5
    }
})