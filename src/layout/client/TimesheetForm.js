import React from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import { WebView } from 'react-native-webview';

export default function TimesheetForm({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <MHeader back={true} navigation={navigation} />
            <View style={styles.webViewContainer}>
                <WebView
                    originWhitelist={['*']}
                    source={{ uri: 'https://www.jotform.com/tables/251466284365059' }}
                    style={styles.webView}
                />
            </View>
            <MFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
    },
    webViewContainer: {
        flex: 1,
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.15,
    },
    webView: {
        flex: 1,
        zIndex: 0,
    },
});
