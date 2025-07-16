import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import MFooter from '../../../components/Mfooter';
import MHeader from '../../../components/Mheader';
import { WebView } from 'react-native-webview';

export default function HospitalityAdminTeamScheduler({ navigation }) {
    const [loading, setLoading] = useState(true); // state to manage loading status

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <MHeader back={true} navigation={navigation} />
            
            {/* Display loading bar or spinner */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={styles.webViewContainer}>
                <WebView
                    originWhitelist={['*']}
                    source={{ uri: 'https://team-scheduler.glide.page' }}
                    style={styles.webView}
                    onLoadStart={() => setLoading(true)}  
                    onLoadEnd={() => setLoading(false)}   
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
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 10,
    }
});
