import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { ThemeConsumer, useThemeMode, Icon } from '@rneui/themed';
import SearchBar from '../components/ui/SearchBar';
import { OPENAI_API_KEY } from "@env";

function Search({ navigation }) {
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    function suggestResults() {
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "system",
                    "content": "You are ChatGPT, a helpful assistant."
                }, {
                    "role": "user",
                    "content": `List 7 search autocompletions for the following phrase: "${searchText}" using a dashed list. The suggestions should be short.`
                }]
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            setSuggestions(data.choices[0].message.content.split("-").slice(1))
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            suggestResults()
        }, 2000)

        return () => {
            clearTimeout(getData)
            console.log('clear')
        }
    }, [searchText])

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.header}>
                        <Icon
                            name="left"
                            type="antdesign"
                            color={theme.colors.secondary}
                            onPress={() => { navigation.goBack() }}
                            size={17.5} />
                        <SearchBar
                            placeholder="Search"
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text)
                            }}
                            containerStyle={{
                                width: '75%'
                            }} />
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('SearchResults', {
                                searchTerm: searchText
                            })
                        }}>
                            <Text style={[styles.searchButtonText, { color: theme.colors.primary }]}> Search </Text>
                        </TouchableOpacity>
                    </View>
                    {suggestions.map((item, i) => {
                        return (
                            <Suggestion
                                key={i}
                                name={item}
                                navigation={navigation}
                            />
                        )
                    })}
                </View>
            )}
        </ThemeConsumer>
    )
}

function Suggestion({ name, navigation }) {
    return (
        <ThemeConsumer>
            {({ theme }) => (
                <TouchableOpacity style={styles.suggestion}
                onPress={()=>{
                    navigation.navigate('SearchResults', {
                        searchTerm: name
                    })
                }}>
                    <Text style={[styles.suggestionText, { color: theme.colors.secondary }]}>{name}</Text>
                </TouchableOpacity>
            )}
        </ThemeConsumer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 30,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    searchButtonText: {
        fontFamily: 'Poppins-SemiBold'
    },
    suggestion: {
        width: '100%',
        backgroundColor: 'transparent',
        marginTop: 10
    },
    suggestionText: {
        fontFamily: 'Poppins-Regular',
        marginLeft: 10,
        marginTop: 10
    }
})

export default Search;