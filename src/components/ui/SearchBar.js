import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Icon, ThemeConsumer } from "@rneui/themed";
import { PRIMARY_COLOR } from "../../constants";

export default function SearchBar({ value, onChangeText, style = {} }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={styles.searchContainer}>
                    <Icon
                        name="search1"
                        type="antdesign"
                        color="grey" 
                        size={17.5}/>
                    <TextInput
                        placeholder="Search"
                        style={[styles.searchBar, { ...style }]}
                        value={value}
                        onChangeText={onChangeText} />
                </View>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10
    },
    searchBar: {
        backgroundColor: 'transparent',
        fontFamily: 'Inter-Regular',
        width: '90%',
        marginLeft: 5,
        fontSize: 16.5
    }
})