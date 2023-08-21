import React, {memo} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, ThemeConsumer } from "@rneui/themed";

function BlogCard({ item, isLastItem, isLiked, onLike, onUnlike, onImagePressed, navigation }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.cardContainer, { marginBottom: isLastItem && 85 }]}>
                    <TouchableOpacity 
                        style={{ backgroundColor: 'transparent' }}
                        onPress={()=>{
                            navigation.navigate('BlogDetails', {
                                blogId: item.blogId
                            })
                        }}>
                        <Text style={[styles.title, { color: theme.colors.secondary }]}> {item.title}</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.secondary }]}> {item.author} </Text>
                    </TouchableOpacity>
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
                    <Text style={styles.hashtag}> #{item.hashtagCategory} </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name={isLiked ? "heart" : "hearto"}
                            color={isLiked ? "red" : theme.colors.secondary}
                            type="antdesign"
                            style={{ alignSelf: 'flex-start', marginTop: 15, marginLeft: 15 }}
                            onPress={isLiked ? onUnlike : onLike} />
                        <Text style={[styles.metric, {color: theme.colors.secondary}]}>{item.likedBy.length}</Text>
                    </View>
                    <Text style={[styles.date, {color: theme.colors.secondary}]}> {item.date} </Text>
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
    }
})

export default memo(BlogCard)