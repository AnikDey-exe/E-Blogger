import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Header as RNHeader, ThemeConsumer, Icon } from '@rneui/themed';
import { PRIMARY_COLOR } from '../../constants';

export default function Header({ navigation, text }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <RNHeader
                    hideStatusBar={true}
                    containerStyle={styles.container}
                    backgroundColor={theme.colors.background}
                    leftComponent={{ text: text, style: styles.heading }} 
                    rightComponent={
                        <Icon
                            name="search1"
                            type="antdesign"
                            color={theme.colors.primary}/>
                    }
                    rightContainerStyle={{
                        marginTop: 7.5
                    }}
                    />
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginRight: 10
    },
    heading: {
        color: PRIMARY_COLOR,
        fontFamily: 'Poppins-Bold',
        fontSize: 25,
        width: 300
    }
})