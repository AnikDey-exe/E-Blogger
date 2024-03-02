import React, { useEffect, memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Icon, ThemeConsumer } from "@rneui/themed";

function BlogCard({ item, isLastItem, isLiked, onLike, onUnlike, onImagePressed, user, navigation, marginBottomVal }) {
    // console.log('card rerender')
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.cardContainer, { marginBottom: isLastItem && marginBottomVal }]}>
                    <View style={styles.metadataContainer}>
                        <Avatar
                            size={50}
                            rounded
                            source={user ? { uri: user.profilePicture } : {}}
                            containerStyle={{ marginLeft: 10 }}
                            onPress={() => {
                                navigation.navigate('UserDetails', {
                                    email: user.email,
                                })
                            }} />
                        <TouchableOpacity
                            style={{ backgroundColor: 'transparent' }}
                            onPress={() => {
                                if (item.status === "published") {
                                    navigation.navigate('BlogDetails', {
                                        blogId: item.blogId,
                                        handle: user.handle
                                    })
                                } else {
                                    navigation.navigate('BlogEdit', {
                                        blog: item
                                    })
                                }
                            }}>
                            <Text style={[styles.title, { color: theme.colors.secondary }]}> {item.title}</Text>
                            <Text style={[styles.subtitle, { color: theme.colors.secondary }]}> {user ? user.handle : ''} </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onImagePressed}>
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={{
                                width: '100%',
                                aspectRatio: 1,
                            }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('SearchResults', {
                            searchTerm: `${item.hashtagCategory}`
                        })
                    }}>
                        <Text style={styles.hashtag}> #{item.hashtagCategory} </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name={isLiked ? "heart" : "hearto"}
                            color={isLiked ? "red" : theme.colors.secondary}
                            type="antdesign"
                            style={{ alignSelf: 'flex-start', marginTop: 15, marginLeft: 15 }}
                            onPress={isLiked ? onUnlike : onLike} />
                        <Text style={[styles.metric, { color: theme.colors.secondary }]}>{item.likedBy.length}</Text>
                    </View>
                    <Text style={[styles.date, { color: theme.colors.secondary }]}> {item.date} </Text>
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: 25,
        backgroundColor: 'transparent'
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        marginBottom: 2.5,
        marginLeft: 10
    },
    subtitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        marginBottom: 15,
        marginLeft: 10
    },
    hashtag: {
        color: '#297eff',
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        marginTop: 10,
        marginLeft: 10
    },
    metric: {
        fontFamily: 'Poppins-Regular',
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10
    },
    date: {
        fontFamily: 'Inter-Regular',
        marginLeft: 10,
        marginTop: 10
    },
    metadataContainer: {
        flexDirection: 'row'
    }
})

export default memo(BlogCard, (p, n) => p.onImagePressed === n.onImagePressed)