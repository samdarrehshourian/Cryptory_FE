import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    ListScreen: undefined;
    HistoryScreen: { name: string, asset_id: string, price_usd: string, icon_url: string }
};

export type ListScreenProps = NativeStackScreenProps<RootStackParamList, 'ListScreen'>;

export type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'HistoryScreen'>;