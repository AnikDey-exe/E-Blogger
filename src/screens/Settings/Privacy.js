import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Switch as RNSwitch
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { ThemeConsumer, Switch } from '@rneui/themed';
import AltHeader from '../../components/layout/AltHeader';
import { PRIMARY_COLOR } from '../../constants';
import OptionList from '../../components/ui/OptionList';

const userSelector = (context) => [context.user]

function Privacy({ navigation }) {
    const dispatch = useDispatch();
    const { user, signOut } = useAuthenticator(userSelector);
    const profile = useSelector(state => state.user.data.find((item) => item.email === user.attributes.email));

    const [checkedOption, setCheckedOption] = useState(profile.accountVisibility);
    const [changing, setChanging] = useState(false);

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="Privacy"
                        background={"transparent"} />
                    <OptionList
                        options={
                            [
                                {
                                    name: "Public"
                                },
                                {
                                    name: "Private"
                                },
                                {
                                    name: "Followers only"
                                }
                            ]
                        }
                        checkedOption={checkedOption} 
                        onChangeOption={setCheckedOption}/>
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

export default Privacy;