import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Header as RNHeader, ThemeConsumer, Icon } from '@rneui/themed';
import { PRIMARY_COLOR } from '../../constants';

export default function AltHeader({ navigation, text, background, hasLeftComponent, rightComponent }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <RNHeader
                    hideStatusBar={true}
                    containerStyle={[styles.container, {borderBottomColor: theme.colors.background}]}
                    backgroundColor={background || theme.colors.background}
                    centerComponent={{ text: text, style: {...styles.heading, color: theme.colors.secondary} }}
                    leftComponent={
                        hasLeftComponent &&
                        <TouchableOpacity 
                            style={{width: 50, height: 50, backgroundColor: 'transparent', alignItems: 'flex-start', justifyContent: 'center'}}
                            onPress={() => { navigation.goBack() }}>
                            <Icon
                                name="left"
                                type="antdesign"
                                color={theme.colors.secondary}
                                onPress={() => { navigation.goBack() }}
                                size={17.5} />
                        </TouchableOpacity>
                    }
                    leftContainerStyle={{
                        marginTop: 6.5
                    }}
                    rightComponent={rightComponent}
                    rightContainerStyle={{
                        marginTop: 2
                    }}
                />
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: -15,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
    },
    heading: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        marginTop: 17
    }
})