import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import AltHeader from '../../components/layout/AltHeader';
import { SETTINGS_ROUTES } from '../../routes';

const userSelector = (context) => [context.user]

function Base({ navigation }) {
    const { user, signOut } = useAuthenticator(userSelector);

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <AltHeader hasLeftComponent={true} navigation={navigation} text="Settings"
                        background={"transparent"} />
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {SETTINGS_ROUTES.map((item, i) => {
                            return (
                                <SettingsTab
                                    key={i}
                                    navigation={navigation}
                                    tabName={item.displayName}
                                    tabNameMarginLeft={item.displayNameMarginLeft}
                                    tabPath={item.path}
                                    iconName={item.iconName}
                                    iconType={item.iconType}
                                    iconSize={item.iconSize} />
                            )
                        })}
                    </ScrollView>

                    <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17.5, color: 'red' }}> Sign Out </Text>
                    </TouchableOpacity>
                </View>
            )}
        </ThemeConsumer>
    )
}

function SettingsTab({ navigation, tabName, tabNameMarginLeft, tabPath, iconName, iconType, iconSize }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <TouchableOpacity onPress={() => { navigation.navigate(tabPath) }}>
                    <View style={styles.tab}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            // borderColor: 'grey',
                            // borderWidth: 1,
                        }}>
                            <Icon
                                name={iconName}
                                type={iconType}
                                color={theme.colors.secondary}
                                size={iconSize}
                            />
                            <Text style={[styles.tabName, { color: theme.colors.secondary, marginLeft: 15 + tabNameMarginLeft }]}>{tabName}</Text>
                        </View>
                        <Icon
                            name="right"
                            type="antdesign"
                            color={theme.colors.secondary}
                            size={20} />
                    </View>
                </TouchableOpacity>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tab: {
        width: '100%',
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        paddingLeft: 22.5,
        paddingRight: 22.5,
        // borderColor: 'grey',
        // borderTopWidth: 1,
    },
    tabName: {
        marginLeft: 15,
        fontFamily: 'Poppins-Regular',
        alignSelf: 'center',
        fontSize: 17.5,
        marginTop: 2.5
    },
    signOutButton: {
        backgroundColor: 'transparent',
        marginLeft: 15,
        marginBottom: 15 
    }
})

export default Base;