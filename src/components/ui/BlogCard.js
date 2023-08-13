import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Icon, ThemeConsumer } from "@rneui/themed";

export default function BlogCard({ item, isLastItem, isLiked, onLike, onUnlike, onImagePressed }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={{ marginTop: 25, marginBottom: isLastItem && 85 }}>
                    <TouchableOpacity>
                        <Text style={{ color: theme.colors.secondary, fontFamily: 'Inter-Bold', fontSize: 20, color: 'black', marginBottom: 2.5, marginLeft: 10 }}> {item.title}</Text>
                        <Text style={{ color: theme.colors.secondary, fontFamily: 'Inter-Regular', fontSize: 15, color: 'black', marginBottom: 15, marginLeft: 10 }}> {item.author} </Text>
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
                    <Text style={{ color: '#297eff', fontFamily: 'Inter-Medium', fontSize: 15, marginTop: 10, marginLeft: 10 }}> #{item.hashtagCategory} </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name={isLiked ? "heart" : "hearto"}
                            color={isLiked ? "red" : theme.colors.secondary}
                            type="antdesign"
                            style={{ alignSelf: 'flex-start', marginTop: 15, marginLeft: 15 }}
                            onPress={onLike} />
                        <Text style={{ fontFamily: 'Poppins-Regular', color: 'black', fontSize: 20, marginTop: 20, marginLeft: 10 }}>{item.likedBy.length}</Text>
                    </View>
                </View>
            )}
        </ThemeConsumer>
    )
}