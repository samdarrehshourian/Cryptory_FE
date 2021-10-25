import * as React from 'react';
import { StyleSheet, View, Text, VirtualizedList } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useQuery } from '@apollo/client'
import AssetItem from '../components/AssetItem';
import { useState, useEffect, useCallback } from 'react';
import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar';
import { ListScreenProps } from '../types/types'

interface ItemObject {
    asset_id: string
    name: string,
    price_usd: string,
    icon_url: string
}

const ASSETS_QUERY = gql`
  query Query {
    assets {
      asset_id
      name
      price_usd
      icon_url
    }
  }
`

const SafeSearchBar = (SearchBar as unknown) as React.FC<SearchBarBaseProps>;

const getItem = (data: ItemObject[], index: number) => {
    if (data) {
        return ({
            asset_id: data[index].asset_id,
            name: data[index].name,
            price_usd: data[index].price_usd,
            icon_url: data[index].icon_url
        });
    }
};

const getItemCount = (data: ItemObject[]) => data.length;

const ListScreen = ({ navigation }: ListScreenProps) => {

    const { data, loading, error } = useQuery(ASSETS_QUERY)
    const [searchedText, setSearchedText] = useState('')
    const [assetsArray, setAsstesArray] = useState(data ? data.assets : [])

    useEffect(() => {
        if (data) {
            setAsstesArray(data.assets)
        }
    }, [data])

    const updateSearchInput = (text: string) => {
        setSearchedText(text)
        let filteredAssets = data.assets.filter((obj: ItemObject) =>
            obj.name.toLowerCase().includes(text.toLowerCase()) ||
            obj.asset_id.toLowerCase().includes(text.toLowerCase())
        )
        setAsstesArray(filteredAssets)
    }

    const isError = error && <Text style={styles.loading}>{error.message}</Text>;
    const isLoading = loading && <Text style={styles.loading}>Loading...</Text>;
    const isDone = data && <VirtualizedList
        style={styles.list}
        data={assetsArray}
        renderItem={({ item }) => <AssetItem asset={item} navigation={navigation} />}
        keyExtractor={(item) => item && item.asset_id ? item.asset_id : ''}
        initialNumToRender={4}
        getItemCount={getItemCount}
        getItem={getItem}
    />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Cryptory</Text>
            </View>
            <SafeSearchBar
                showLoading={loading}
                placeholder="Search on cryptos ..."
                platform={'default'}
                containerStyle={styles.containerStyle}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                searchIcon={{ size: 30, color: "#e5e5e5" }}
                onChangeText={updateSearchInput}
                value={searchedText} />
            <View style={styles.loadingContainer}>
                {isError || isLoading || isDone}
            </View>
        </SafeAreaView>

    )
}

export default ListScreen;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#141414',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'
    },
    loading: {
        color: '#e5e5e5',
        marginTop: 80,
        fontSize: 20,

    },
    list: {
        backgroundColor: '#141414',
        width: '100%',
        position: 'relative',
        height: '100%'
    },
    containerStyle: {
        width: '95%',
        backgroundColor: "#141414",
        borderTopColor: "#141414",
        borderBottomColor: "#141414",
        marginVertical: 0,
        padding: 0,
        paddingHorizontal: 5,
        borderLeftColor: '#e5e5e5',
        borderRightColor: '#e5e5e5',
    },
    inputContainerStyle: {
        backgroundColor: "#141414",
    },
    titleContainer: {
        height: 100,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center'

    },
    title: {
        color: "#e5e5e5",
        fontSize: 35,
        fontWeight: 'bold',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#141414',
    },
    inputStyle: {
    }
});