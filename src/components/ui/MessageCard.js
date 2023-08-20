import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, ThemeConsumer } from "@rneui/themed";

export default function MessageCard({ item }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={styles.messageContainer}>
                    <Text style={[styles.author, { color: theme.colors.secondary }]}>{item.author}</Text>
                    <Text style={[styles.message, { color: theme.colors.secondary }]}>{item.message} </Text>
                    {item.image != ''
                        &&
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image} />
                    }
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        marginBottom: 17.5,
        backgroundColor: 'transparent'
    },
    message: {
        fontFamily: 'Inter-Regular',
        fontSize: 16.5
    },
    author: {
        fontFamily: 'Inter-Medium'
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        marginTop: 5
    }
})