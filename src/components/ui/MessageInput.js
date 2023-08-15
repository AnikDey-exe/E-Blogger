import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { ThemeConsumer } from '@rneui/themed';

export default function MessageInput({ value, onChangeText, style = {} }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <TextInput
                    placeholder="Message"
                    multiline={true}
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, { ...style }]} />
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    input: {
        width: '65%',
        height: 50,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#d6d6d6',
        borderRadius: 5,
        paddingLeft: 10,
        fontFamily: 'Inter-Regular'
    }
})