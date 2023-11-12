import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Icon, ThemeConsumer } from "@rneui/themed";

export default function UserCard({ user, navigation }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            navigation.navigate('UserDetails', {
                                email: user.email
                            })
                        }}
                        style={[styles.userContainer, { backgroundColor: theme.colors.background }]}>
                        <Avatar
                            size={50}
                            rounded
                            source={{
                                uri: user.profilePicture
                            }}
                            containerStyle={{
                                borderColor: 'black',
                                borderWidth: 0.5,
                                zIndex: -2,
                                alignSelf: 'center'
                            }} />
                        <View style={styles.metadataContainer}>
                            <Text style={[styles.metadata, { color: theme.colors.secondary }]}>{user.handle}</Text>
                            <Text style={[styles.metadataSecondary, { color: theme.colors.secondary, fontSize: 13.5 }]}>{user.followers.length} followers</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    userContainer: {
        width: '100%',
        height: 'fit-content',
        flexDirection: 'row',
        padding: 20,
        paddingTop: 10,
        paddingBottom: 10,
        // justifyContent: 'space-between',
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'black'
    },
    metadataContainer: {
        marginLeft: 15,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'black'
    },
    metadata: {
        fontFamily: 'Poppins-Bold',
        fontSize: 17.5
    },
    metadataSecondary: {
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
    }
})