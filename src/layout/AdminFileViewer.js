import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import Pdf from 'react-native-pdf';
import Loader from './Loader';

export default function AdminFileViewer({ navigation, route }) {
    const { fileData } = route.params;
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [fileInfo, setFileInfo] = useState({ content: '', type: '', name: '' });

    const setData = async () => {
        setLoading(true);
        const fetchedFileInfo = fileData;
        console.log(fileData);
        let content = '';

        if (fetchedFileInfo.type === 'pdf') {
            // For PDF, no need to generate HTML
            setFileInfo(fetchedFileInfo);
        } else if (fetchedFileInfo.type === 'image') {
            content = `
                <html>
                <body style="margin: 0; padding: 0;">
                    <img src="data:image/jpeg;base64,${fetchedFileInfo.content}" style="display: block; margin-left: auto; margin-right: auto; width: 80%;"/>
                </body>
                </html>
            `;
            setHtmlContent(content);
            setFileInfo(fetchedFileInfo);
        } else {
            content = `
                <html>
                    <body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100%;">
                        <p>No valid file type found.</p>
                    </body>
                </html>
            `;
            setHtmlContent(content);
        }
        setLoading(false);
    };

    useEffect(() => {
        setData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { fontWeight: 'normal' }]} onPress={() => navigation.goBack()}>{"Back"}</Text>
                <Text style={[styles.headerTitle, { width: '70%' }]}>{fileInfo.name}</Text>
                <Text></Text>
            </View>
            {fileInfo.type === 'pdf' ? (
                <Pdf
                    source={{ uri: fileInfo.content }}
                    style={styles.pdf}
                />
            ) : (
                fileInfo.content && <Image
                    source={{ uri: fileInfo.content }}
                    style={styles.webView}
                    resizeMode="contain"
                />
            )}
            <Loader visible={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    webView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingTop: 100
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    }
});
