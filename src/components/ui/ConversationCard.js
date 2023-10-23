import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Icon, ThemeConsumer } from "@rneui/themed";
import { getDiffBetweenDates } from "../../utils";
import { likeComment, unlikeComment } from "../../database/services/mutations";

export default function ConversationCard({ name, altName, avatar, date, subheading, onPress }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={styles.container}>
                    <TouchableOpacity 
                        style={[styles.conversationContainer, { backgroundColor: theme.colors.background }]}
                        onPress={onPress}>
                        <Avatar
                            size={50}
                            rounded
                            source={{
                                uri: avatar
                            }} 
                            containerStyle={{
                                borderColor: 'black',
                                borderWidth: 0.5,
                                zIndex: -2,
                                alignSelf: 'center'
                            }}/>
                        <View style={styles.metadataContainer}>
                            {name && <Text style={[styles.metadata, {color: theme.colors.secondary}]}>{name}</Text>}
                            {altName && <Text style={[styles.metadataSecondary, { fontFamily: 'Poppins-Medium', marginTop: -10}]}>{altName}</Text>}
                            {subheading && <Text style={[styles.metadataSecondary, {color: theme.colors.secondary}]}>{subheading}</Text>}
                        </View>
                        <Text style={[styles.metadataSecondary, {color: theme.colors.secondary, fontSize: 13.5, position: 'absolute', top: 12.5, right: 15}]}>{date}</Text>
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
    conversationContainer: {
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
        marginLeft: 10,
        width: '50%',
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