import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Header as RNHeader, ThemeConsumer, Icon } from '@rneui/themed';
import { PRIMARY_COLOR } from '../../constants';

export default function AltHeader({ navigation, text, background }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <RNHeader
                    hideStatusBar={true}
                    containerStyle={styles.container}
                    backgroundColor={background || theme.colors.background}
                    centerComponent={{ text: text, style: styles.heading }}
                    leftComponent={
                        <Icon
                            name="left"
                            type="antdesign"
                            color={theme.colors.primary} 
                            onPress={()=>{navigation.goBack()}}/>
                    }
                    leftContainerStyle={{
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
        fontFamily: 'Inter-Bold',
        fontSize: 25
    }
})