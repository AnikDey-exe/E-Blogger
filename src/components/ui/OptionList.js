import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, ThemeConsumer } from "@rneui/themed";
import { PRIMARY_COLOR } from "../../constants";

export default function OptionList({ options, checkedOption, onChangeOption, disabled, containerStyle = {} }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background, ...containerStyle }]}>
                    {options.map((item, i) => {
                        return (
                            <TouchableOpacity 
                                key={i}
                                disabled={disabled}
                                style={[styles.optionButton, { backgroundColor: theme.colors.background, opacity: disabled ? 0.5 : 1 }]}
                                onPress={()=>{
                                    onChangeOption(item.name)
                                }}>
                                <Text style={[styles.optionText, { color: theme.colors.secondary }]}> {item.name} </Text>
                                {checkedOption.toLowerCase() === item.name.toLowerCase() &&
                                    <Icon
                                        name="check"
                                        color={PRIMARY_COLOR}/>}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center'
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 1,
        // borderColor: 'black',
        alignItems: 'center',
        height: 50
    },
    optionText: {
        fontFamily: 'Poppins-Regular',
        marginTop: 2.5,
        fontSize: 17.5
    }
})