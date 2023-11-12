import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Icon, ThemeConsumer } from "@rneui/themed";
import { getDiffBetweenDates } from "../../utils";
import PopupMenu from "./PopupMenu";

export default function NotificationCard({ message, date, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>{setShowMenu(false)}}
                        style={[styles.notificationContainer, { backgroundColor: theme.colors.background }]}>
                        <View style={styles.metadataContainer}>
                            {message && <Text style={[styles.metadataSecondary, { color: theme.colors.secondary }]}>{message}</Text>}
                            <Text style={[styles.metadataSecondary, { color: theme.colors.secondary, fontSize: 13.5 }]}>{date}</Text>
                        </View>
                        <Icon
                            name="dots-three-vertical"
                            type="entypo"
                            color={theme.colors.secondary}
                            containerStyle={{ position: 'absolute', top: 10, right: 10 }}
                            onPress={() => {
                                setShowMenu(true);
                            }}
                        />
                        {showMenu && 
                            <PopupMenu
                                options={[
                                    {
                                        name: 'Delete',
                                        onPress: onDelete
                                    }
                                ]}/>
                        }
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
    notificationContainer: {
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
        marginLeft: 0,
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