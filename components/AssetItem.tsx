import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';

const AssetItem = ({ asset, navigation }: any) => {
    const { name, asset_id, price_usd, data_trade_start, icon_url } = asset
    const default_url = 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_512/4caf2b16a0174e26a3482cea69c34cba.png';
    const price_usd_rounded = Math.round(price_usd * 100) / 100
    const url = icon_url ? icon_url : default_url

    return (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('HistoryScreen', { name: name, asset_id: asset_id, price_usd: price_usd_rounded, icon_url: url, data_trade_start: data_trade_start })}>
            <View style={styles.nameContainer}>
                <Image
                    style={styles.logo}
                    source={{ uri: url }}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.itemName}>{name}</Text>
                    <Text style={styles.itemID}>{asset_id}</Text>
                </View>

            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.priceTxt}>{price_usd === null ? '-' : "$ " + price_usd_rounded}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default AssetItem;

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        backgroundColor: '#333333',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        marginVertical: 4,
        borderRadius: 8

    },
    itemName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#e5e5e5"
    },
    itemID: {
        fontSize: 16,
        color: "#e5e5e5"
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'

    },
    priceContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        height: '100%',
        flexDirection: 'row'
    },
    priceTxt: {
        color: "#e5e5e5",
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    logo: {
        width: 20,
        height: 20,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginRight: 12,
    },
    textContainer: {
        display: 'flex',

    }
});