import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { Avatar, ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../../components/layout/AltHeader';
import Alert from '../../components/ui/Alert';
import { selectImage, uploadImage, getImage } from '../../utils';
import { updateProfilePicture, updateProfile } from '../../database/services/mutations';
import { updateUserProfilePicture, updateUser } from '../../features/user/userSlice';

const userSelector = (context) => [context.user]

function ProfileEdit({ navigation }) {
    const dispatch = useDispatch();
    const { user, signOut } = useAuthenticator(userSelector);
    const profile = useSelector(state => state.user.data.find((item) => item.email === user.attributes.email));

    const [handle, setHandle] = useState(profile.handle);
    const [bio, setBio] = useState(profile.bio);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('Your profile has been updated.');

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: !alertVisible ? theme.colors.background: 'rgba(0, 0, 0, 0.5)' }]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="Edit Profile"
                        background={"transparent"} 
                        rightComponent={
                            <TouchableOpacity 
                                style={styles.saveButton} 
                                disabled={handle === '' ? true : false}
                                onPress={async ()=>{
                                    await updateProfile(user.attributes.email, handle, bio)
                                    setAlertVisible(true)
                                    dispatch(updateUser({id: profile._id, handle: handle, bio: bio}))
                                }}>
                                <Text style={[styles.saveText, {color: theme.colors.primary, opacity: handle === '' ? 0.5 : 1}]}> Save </Text>
                            </TouchableOpacity>
                        }/>
                    <Alert visible={alertVisible} onClose={()=>{
                        setAlertVisible(false)
                    }} message={alertMessage}/>
                    <ScrollView contentContainerStyle={styles.innerContainer}>
                        <Avatar
                            size={200}
                            rounded
                            source={{ uri: profile.profilePicture }}
                            containerStyle={{
                                borderColor: 'black',
                                borderWidth: 0.5
                            }} 
                            onPress={()=>{
                                selectImage(async function(res) {
                                    if(!res.error) {
                                        const src = res.source;
                                        await uploadImage(`profile/${user.attributes.email}`, src);
                                        let pngSrc = await getImage(`profile/${user.attributes.email}`);
                                        await updateProfilePicture(user.attributes.email, pngSrc);
                                        dispatch(updateUserProfilePicture({id: profile._id, profilePicture: pngSrc}));
                                    }
                                })
                            }}
                           >
                             <Avatar.Accessory size={50} />
                           </Avatar>
                        <CustomInput
                            title="Username"
                            placeholder=""
                            value={handle}
                            onChangeText={(text) => {
                                setHandle(text)
                            }}
                            multiline={true}
                            containerStyle={{ marginTop: 20 }} />
                        <CustomInput
                            title="About Me"
                            placeholder=""
                            value={bio}
                            onChangeText={(text) => {
                                setBio(text)
                            }}
                            multiline={true}
                            style={{
                                height: 100,
                                textAlignVertical: 'top'
                            }}
                            containerStyle={{ marginTop: 20 }} />
                    </ScrollView>
                </View>
            )}
        </ThemeConsumer>
    )
}

function CustomInput({ title, value, placeholder, onChangeText, multiline, style = {}, containerStyle = {} }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.inputContainer, { ...containerStyle }]}>
                    <Text style={[styles.inputTitle, { color: theme.colors.secondary }]}>{title}</Text>
                    <TextInput
                        placeholder={placeholder}
                        placeholderTextColor={theme.colors.secondary}
                        value={value}
                        onChangeText={onChangeText}
                        style={[styles.input, { ...style, color: theme.colors.secondary, borderBottomColor: theme.colors.secondary }]}
                        multiline={multiline} />
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        alignItems: 'center'
    },
    inputContainer: {
        width: '90%',
        alignSelf: 'center'
    },
    input: {
        borderBottomWidth: 0.5,
        backgroundColor: 'transparent',
        width: '100%',
        paddingLeft: 0,
        fontFamily: 'Inter-Regular',
        marginTop: 0
    },
    inputTitle: {
        marginTop: 12.5,
        fontFamily: 'Poppins-Regular',
        fontSize: 17.5
    },
    saveButton: {
        marginTop: 17.5
    },
    saveText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 15
    }
})

export default ProfileEdit;