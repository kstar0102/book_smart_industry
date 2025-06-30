import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function HospitalityHotelHireTimescheduling({ navigation }) {
  const webviewRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { height, width } = Dimensions.get('window');
      setOrientation(height >= width ? 'portrait' : 'landscape');
    };

    updateOrientation();

    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => subscription?.remove();
  }, []);

  const sendZoomToWebView = (zoom) => {
    const js = `
      (function() {
        if (!document.querySelector('meta[name=viewport]')) {
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=${zoom}, maximum-scale=2.0, user-scalable=yes';
          document.head.appendChild(meta);
        }

        document.body.style.zoom = ${zoom};
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
          const wrapper = document.createElement('div');
          wrapper.style.overflowX = 'auto';
          wrapper.style.width = '100%';
          wrapper.appendChild(table.cloneNode(true));
          table.parentNode.replaceChild(wrapper, table);

          wrapper.firstChild.style.minWidth = '1200px';
          wrapper.firstChild.style.width = '100%';
          wrapper.firstChild.style.boxSizing = 'border-box';
        });

        true;
      })();
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
      <View style={{ height: 20 }} />

      <View style={styles.webViewContainer}>
        <WebView
          key={orientation}
          ref={webviewRef}
          originWhitelist={['*']}
          scrollEnabled={true}
          scalesPageToFit={Platform.OS === 'ios'}
          source={{ uri: 'https://www.jotform.com/tables/251466284365059' }}
          style={styles.webView}
          injectedJavaScript={`
            (function() {
              // Ensure viewport tag
              if (!document.querySelector('meta[name=viewport]')) {
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes';
                document.head.appendChild(meta);
              }
          
              // Zoom setup
              document.body.style.zoom = ${zoomLevel};
              document.body.style.overflow = 'auto';
              document.documentElement.style.overflow = 'auto';
          
              // Expand outer container (JotForm table wrapper)
              const mainContainer = document.querySelector('[class*=TableView]');
              if (mainContainer) {
                mainContainer.style.minWidth = '2000px';   // allow full horizontal scroll
                mainContainer.style.overflowX = 'auto';
              }
          
              // Also modify its parent if it restricts width
              const parent = mainContainer?.parentElement;
              if (parent) {
                parent.style.overflowX = 'auto';
                parent.style.minWidth = '2000px';
              }
          
              // Wrap each <table> in scrollable div (fallback for raw HTML)
              const tables = document.querySelectorAll('table');
              tables.forEach(table => {
                const wrapper = document.createElement('div');
                wrapper.style.overflowX = 'auto';
                wrapper.style.width = '100%';
                wrapper.appendChild(table.cloneNode(true));
                table.parentNode.replaceChild(wrapper, table);
          
                wrapper.firstChild.style.minWidth = '2000px';
                wrapper.firstChild.style.width = '100%';
              });
          
              true;
            })();
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
    overflowX: 'scroll', // add this
  },
  webView: {
    flex: 1,
    minWidth: 2000,
    minWidth: '100%',
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
    width: 100,
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
    right: 20,
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
