import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch as RNSwitch
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { ThemeConsumer, useThemeMode } from '@rneui/themed';
import AltHeader from '../../components/layout/AltHeader';
import { PRIMARY_COLOR } from '../../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const userSelector = (context) => [context.user]

function ThemeMode({ navigation }) {
    const dispatch = useDispatch();
    const { user, signOut } = useAuthenticator(userSelector);

    const { mode, setMode } = useThemeMode();

    const [checked, setChecked] = useState(mode === 'dark');
    const [changing, setChanging] = useState(false);

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="Theme"
                        background={"transparent"} />
                    <View style={styles.switchContainer}>
                        <View style={styles.innerSwitchContainer}>
                            <View style={{ width: '75%' }}>
                                <Text style={[styles.label, { color: theme.colors.secondary }]}> Dark </Text>

                            </View>
                            <View style={{ marginLeft: 47.5 }}>
                                <RNSwitch
                                    trackColor={{ false: '#d6d6d6', true: PRIMARY_COLOR }}
                                    thumbColor={checked ? PRIMARY_COLOR : '#cccccc'}
                                    disabled={changing}
                                    value={checked}
                                    onValueChange={async () => {
                                        setMode(mode === 'dark' ? 'light' : 'dark')
                                        try {
                                            await AsyncStorage.setItem('theme', mode === 'dark' ? 'light' : 'dark');
                                        } catch (e) {
                                            console.log(e)
                                        }
                                        setChecked(prevState => !prevState);
                                        // // this is the state it was before (if it was false before, now it is true)
                                        // let option = checked ? 'relative' : 'absolute';
                                        // setChanging(true);
                                        // await updateDateOption(user.attributes.email, option);
                                        // dispatch(updateUserDateOption({id: profile._id, dateOption: option}));
                                        // setChanging(false);
                                    }}
                                />
                            </View>
                        </View>
                        <Text style={[styles.labelDescription, { color: 'grey' }]}>Light mode is the default theme </Text>
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
    switchContainer: {
        width: '90%',
        alignSelf: 'center',
        // borderStyle: 'solid',
        // borderWidth: 1
    },
    innerSwitchContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 17.5
    },
    labelDescription: {
        fontFamily: 'Poppins-Regular',
        marginLeft: 5,
        marginTop: 0,
        width: '90%'
    }
})

export default ThemeMode;