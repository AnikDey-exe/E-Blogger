import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeConsumer } from '@rneui/themed';

export default function GlobalButton({ children, onPress, disabled, style = {} }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <TouchableOpacity 
                    onPress={onPress} 
                    disabled={disabled ? disabled : false}
                    style={[styles.button, { backgroundColor: theme.colors.primary, ...style }]}>
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