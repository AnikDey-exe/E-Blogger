import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Icon, ThemeConsumer } from "@rneui/themed";

export default function PopupMenu({ options }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.menu, {backgroundColor: theme.colors.background}]}>
                    {options.map((item, i)=>{
                        return (
                            <TouchableOpacity key={i}
                            onPress={async () => {
                                item.onPress()
                            }}>
                                <Text style={[styles.optionText, {color: theme.colors.secondary}]}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                  
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    menu: {
        position: 'absolute', 
        top: 10, 
        right: 10, 
        height: 'fit-content',
        width: 70,
        shadowOpacity: 10,
        shadowRadius: 5,
        shadowColor: 'black',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        padding: 10
    },
    optionText: {
        fontFamily: 'Poppins-Regular'
    }
})