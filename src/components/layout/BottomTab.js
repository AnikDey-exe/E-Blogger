import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '@rneui/themed';
import { BOTTOM_TAB_ROUTES } from '../../routes';
import { useThemeMode, ThemeConsumer } from '@rneui/themed';

export default function BottomTab({ navigation, currentTab }) {
    const { mode, setMode } = useThemeMode();

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.bottomTabContainer, {backgroundColor: theme.colors.background}]}>
                    {BOTTOM_TAB_ROUTES.map((item, i) => {
                            return (
                                <Icon
                                    key={i}
                                    name={currentTab === item.path ? item.selected.iconName : item.iconName}
                                    type={currentTab === item.path ? item.selected.iconType : item.iconType}
                                    onPress={() => {
                                        navigation.navigate(item.path)
                                    }}
                                    color={theme.colors.primary}
                                    size={30} />
                            )
                        }
                    )}
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    bottomTabContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderTopWidth: 0.5,
        borderStyle: 'solid',
        borderTopColor: '#d6d6d6',
        // borderTopLeftRadius: 25,
        // borderTopRightRadius: 25,
        // shadowOpacity: 10,
        // shadowRadius: 5,
        // shadowColor: 'black',
        // elevation: 15,
        // shadowOffset: { width: 5, height: 5 },
        alignItems: 'center',
    }
})