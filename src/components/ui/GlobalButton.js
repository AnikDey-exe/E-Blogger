import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeConsumer } from '@rneui/themed';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function GlobalButton({ children, onPress, style = {} }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: theme.colors.primary, ...style }]}>
                    {children}
                </TouchableOpacity>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    }
})