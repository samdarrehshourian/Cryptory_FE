import * as React from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useQuery } from '@apollo/client'
import { AntDesign } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'
import { useState } from 'react';
import moment from 'moment';
import { HistoryScreenProps } from '../types/types'

interface ButtonProp {
    time_span: string,
    label: string
}

interface HistoricData {
    rate_close: number,
    time_period_start: string
}

const timeSpans = [
    {
        time_span: '1H',
        label: '1 Hour'
    },
    {
        time_span: '1D',
        label: '1 Day'
    },
    {
        time_span: '1M',
        label: '1 Month'
    },
    {
        time_span: '1Y',
        label: '1 Year'
    },
]

const getTimeLables = (time_period_start: string, period: string) => {
    switch (period) {
        case '5MIN':
            var t = moment.utc(time_period_start).format("HH:mm")
            return t;
        case '3HRS':
            var t = moment.utc(time_period_start).format("HH:mm")
            return t;
        case '5DAY':
            var t = moment.utc(time_period_start).format("YYYY-MM-DD")
            return t;
        case '10DAY':
            var t = moment.utc(time_period_start).format("YYYY-MM")
            return t;
    }
}

const HistoryScreen = ({ navigation, route }: HistoryScreenProps) => {
    const today = new Date()
    today.setHours(today.getHours() - 1)

    const { name, asset_id, price_usd, icon_url } = route.params
    const [period, setPeriod] = useState('5MIN')
    const [timeStart, setTimeStart] = useState(today.toISOString())
    const [buttonSelected, setButtonSelected] = useState('1H')

    const GET_CRYPTO_DATA = gql`
    query Query($asset_id: String!, $period_id: String!, $time_start: String!) {
        historicData(ASSET_ID: $asset_id, PERIOD_ID: $period_id, TIME_START: $time_start) {
            time_period_start
            rate_close
        }
    }
    `;

    const { loading, error, data } = useQuery(
        GET_CRYPTO_DATA,
        {
            variables: { asset_id: asset_id, period_id: period, time_start: timeStart },
            notifyOnNetworkStatusChange: true
        })

    const setTimeSpan = (filterTime: string) => {
        let date = new Date()
        let period_id = period
        let time_start = timeStart

        switch (filterTime) {
            case '1H':
                date.setHours(date.getHours() - 1)
                time_start = date.toISOString()
                period_id = '5MIN'
                break;
            case '1D':
                date.setDate(date.getDate() - 1)
                time_start = date.toISOString()
                period_id = '3HRS'
                break;
            case '1M':
                date.setMonth(date.getMonth() - 1)
                time_start = date.toISOString()
                period_id = '5DAY'
                break;
            case '1Y':
                date.setFullYear(today.getFullYear() - 1)
                time_start = date.toISOString()
                period_id = '10DAY'
                break;
        }
        setPeriod(period_id)
        setTimeStart(time_start)
    }

    const rate_closed_array = data && data.historicData.map(({ rate_close }: HistoricData) => Number(rate_close))

    const xLabel_time = data && data.historicData.map(({ time_period_start }: HistoricData) =>
        getTimeLables(time_period_start, period)
    )

    const chartConfig = {
        backgroundColor: "#141414",
        backgroundGradientFrom: "#141414",
        backgroundGradientTo: "#141414",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16,
            height: 100

        },
        propsForDots: {
            r: "1",
            strokeWidth: "2",
            stroke: "#ffa726"
        },
        propsForHorizontalLabels: {
            fontSize: "9",
            fontWeight: 'bold'
        },
    }

    const isError = error && <Text style={styles.error}>{error.message}</Text>;
    const isLoading = loading && <ActivityIndicator size="large" color="#e5e5e5" />;
    const isDone = data && rate_closed_array && xLabel_time && <LineChart
        data={{
            labels: xLabel_time,
            datasets: [
                {
                    data: rate_closed_array
                }
            ]
        }}
        withVerticalLabels={true}
        width={Dimensions.get("window").width * 0.98} // from react-native
        height={Dimensions.get('window').height * 0.6}
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig}
        style={styles.chartStyle}
        verticalLabelRotation={90}
        withHorizontalLabels={true}
        withHorizontalLines={true}
        withVerticalLines={false}
        xLabelsOffset={5}
        yLabelsOffset={2}
    />

    const rednerButton = ({ time_span, label }: ButtonProp) => {
        return (
            <TouchableOpacity key={time_span} onPress={() => buttonClicked(time_span)} disabled={loading}>
                <Text style={buttonSelected === time_span ? styles.buttonSelected : styles.buttonNotSelected}>{label}</Text>
            </TouchableOpacity>
        )
    }

    const buttonClicked = (span: string) => {
        setTimeSpan(span)
        setButtonSelected(span)
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('ListScreen')} style={styles.backIconContainer}>
                <AntDesign name="arrowleft" size={32} color="#e5e5e5" />
            </TouchableOpacity>
            <View style={styles.assetContainer}>
                <View style={styles.assetInformationContainer}>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={{ uri: icon_url }} />
                    </View>
                    <View style={styles.nameAndIDContainer}>
                        <Text style={styles.assetName}>{name}</Text>
                        <Text style={styles.assetID}>{asset_id}</Text>
                    </View>
                </View>
                <View style={styles.assetPriceContainer}>
                    <Text style={styles.price}>{price_usd === null ? '-' : "$ " + price_usd}</Text>
                </View>
            </View>
            <View style={styles.optionsContainer}>
                {timeSpans.map(rednerButton)}
            </View>
            <View style={styles.chartContainer}>
                {isError || isLoading || isDone}
            </View>
        </SafeAreaView>
    )
}

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#141414',
        justifyContent: 'flex-start',
    },
    logo: {
        width: 20,
        height: 20,
        paddingHorizontal: 18,
        paddingVertical: 18,
        marginRight: 12,
    },
    backIconContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        height: 50,
        marginTop: 20
    },
    assetContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    assetName: {
        color: "#e5e5e5",
        fontSize: 20,

    },
    assetID: {
        color: "#e5e5e5",
        fontSize: 20,
    },
    assetPriceContainer: {
        justifyContent: 'center'
    },
    price: {
        color: "#e5e5e5",
        fontSize: 20,
        fontWeight: 'bold'

    },
    assetInformationContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    logoContainer: {
        justifyContent: 'center'
    },
    nameAndIDContainer: {
        justifyContent: 'center'
    },
    lineChart: {
        height: 280
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        height: 90,
        alignItems: 'center',
    },
    option: {
        color: '#e5e5e5'
    },
    chartContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        width: '100%',
        height: 500
    },
    error: {
        color: '#e5e5e5',
        fontSize: 20,
    },
    chartStyle: {
        marginVertical: 30,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonNotSelected: {
        color: '#e5e5e5',
        fontSize: 14

    },
    buttonSelected: {
        color: '#ffa726',
        fontWeight: 'bold',
        fontSize: 16
    }
});