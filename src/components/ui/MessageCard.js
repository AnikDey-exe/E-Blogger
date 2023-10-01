import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, ThemeConsumer } from "@rneui/themed";
import { getDiffBetweenDates } from "../../utils";
import { likeComment, unlikeComment } from "../../database/services/mutations";

export default function MessageCard({ item, isLiked, email, absoluteDate }) {
    const [liked, setLiked] = useState(isLiked);
    const [likes, setLikes] = useState(item.likedBy.length)

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={styles.messageContainer}>
                    <View style={styles.metadataContainer}>
                        <Text style={[styles.metadata, { color: theme.colors.secondary }]}>{item.author}</Text>
                        <Text style={[styles.metadata, { color: 'grey', marginLeft: 10 }]}>{!absoluteDate ? getDiffBetweenDates(item.utcDate, Date.now()) + 'd' : item.date}</Text>
                    </View>
                    <Text style={[styles.message, { color: theme.colors.secondary }]}>{item.message} </Text>
                    {item.image != ''
                        &&
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image} />
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name={liked ? "heart" : "hearto"}
                            color={liked ? "red" : theme.colors.secondary}
                            type="antdesign"
                            style={{ alignSelf: 'flex-start', marginTop: 10 }}
                            onPress={async () => {
                                if (liked) {
                                    await unlikeComment(item._id, email)
                                    setLiked(false)
                                    setLikes(prevLikes => prevLikes - 1)
                                } else {
                                    await likeComment(item._id, email)
                                    setLiked(true)
                                    setLikes(prevLikes => prevLikes + 1)
                                }
                            }}
                        />
                        <Text style={[styles.metric, { color: theme.colors.secondary }]}>{likes}</Text>
                    </View>
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        marginBottom: 20,
        backgroundColor: 'transparent'
    },
    message: {
        fontFamily: 'Inter-Regular',
        fontSize: 16.5
    },
    metadata: {
        fontFamily: 'Inter-Medium'
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        marginTop: 5
    },
    metadataContainer: {
        flexDirection: 'row'
    },
    metric: {
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
        marginTop: 15,
        marginLeft: 10
    }
})