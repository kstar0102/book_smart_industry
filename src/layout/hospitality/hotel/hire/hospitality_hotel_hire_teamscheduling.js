import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Button,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import MFooter from '../../../../components/Mfooter';
import MHeader from '../../../../components/Mheader';

export default function HospitalityHotelHireTimescheduling({ navigation }) {
  const webviewRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0.7);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setOrientation(height >= width ? 'portrait' : 'landscape');
    };

    updateOrientation(); // initial

    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => subscription?.remove();
  }, []);

  const sendZoomToWebView = (zoom) => {
    const js = `
      if (!document.querySelector('meta[name=viewport]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=${zoom}, maximum-scale=2.0, user-scalable=yes';
        document.head.appendChild(meta);
      }
      document.body.style.zoom = ${zoom};
      true;
    `;
    webviewRef.current?.injectJavaScript(js);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.1, 2);
    setZoomLevel(newZoom);
    sendZoomToWebView(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.1, 0.1);
    setZoomLevel(newZoom);
    sendZoomToWebView(newZoom);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" />
        <TouchableOpacity style={styles.floatingCloseButton} onPress={() => navigation.goBack()}>
    <Text style={styles.closeText}>✕</Text>
  </TouchableOpacity>
        <View style = {{height : 20}}/> 
      

        <View style={styles.webViewContainer}>
            <WebView
            key={orientation} // re-render on orientation change
            ref={webviewRef}
            originWhitelist={['*']}
            scrollEnabled={true}
            scalesPageToFit={Platform.OS === 'ios'} // optional
            source={{ uri: 'https://www.jotform.com/tables/251466284365059' }}
            style={styles.webView}
            injectedJavaScript={`
                if (!document.querySelector('meta[name=viewport]')) {
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=${zoomLevel}, maximum-scale=2.0, user-scalable=yes';
                document.head.appendChild(meta);
                }
                document.body.style.zoom = ${zoomLevel};
                true;
            `}
            />
        </View>
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                <Text style={styles.zoomText}>- Zoom Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                <Text style={styles.zoomText}>+ Zoom In</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webViewContainer: {
    flex: 1,
    width: '100%',
  },
  webView: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    backgroundColor: '#eef0f4',
    zIndex: 10,
  },
  zoomButton: {
    backgroundColor: '#A020F0',
    borderRadius: 25,
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  
  zoomText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20, // change to `left: 20` for left side
    backgroundColor: '#FF3B30',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
