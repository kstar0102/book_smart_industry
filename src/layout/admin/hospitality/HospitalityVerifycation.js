import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, StatusBar, Modal, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import RNBlobUtil from "react-native-blob-util";
import MFooter from '../../../components/Mfooter';
import MHeader from '../../../components/Mheader';
import { getUserInfo, Update } from '../../../utils/useApi';
import Loader from '../../Loader';
import { RFValue } from 'react-native-responsive-fontsize';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs'
import images from '../../../assets/images';

const { width, height } = Dimensions.get('window');

export default function HospitalityVerifyCation ({ navigation, route }) {
    const { id, userRole } = route.params;

    const [loading, setLoading] = useState(false);
    const [sfileType, setFiletype] = useState('');
    const [resume, setResume] = useState({ name: '', content: '', type: '' });
    const [resumeUrl, setResumeUrl] = useState("");
    const [resumeUpload, setResumeUpload] = useState(false);
    const [fileTypeSelectModal, setFiletypeSelectModal] = useState(false);
    async function getData() {
        setLoading(true);
        let response = await getUserInfo({ userId: id, userRole: userRole }, 'hospitality');

        if (!response?.error) {
            console.log(response.userData['resume']);
            if (response.userData['resume']) {
                setResume(response.userData['resume']);
            }
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSendFile = async (target) => {
        let data = {};
        if (target == "resume") {
            data = {
                resume: resume,
                userId: id,
                userRole: userRole
            };
            setResumeUpload(false);
        }
    
        setLoading(true);

        try {
          const response = await Update(data, 'hospitality');
          if (!response?.error) {
            data = {};
            setLoading(false);
            Alert.alert(
                'Success!',
                'Updated',
                [
                    {
                    text: 'OK',
                    onPress: () => {
                        console.log('');
                    },
                    },
                ],
                { cancelable: false }
            );
          } else {
            console.log('=====================');
            console.log(JSON.stringify(response.error));
          }
        } catch (error) {
          setLoading(false);
          console.error('Update failed: ', error)
        }
    };

    const handleCredentials = (target, e) => {
        if (target == "resume") {
            setResume((prev) => ({ ...prev, ...e }));
            setResumeUpload(true);
        }
    };

    const handleSetUrl = (target, e) => {
        if (target == "resume") {
            setResumeUrl(e);
        }
    };

    const toggleFileTypeSelectModal = () => {
        setFiletypeSelectModal(!fileTypeSelectModal);
    };

    const handleChangeFileType = (name) => {
        setFiletype(name);
        toggleFileTypeSelectModal();
    };

    const openCamera = async () => {
        const options = {
            mediaType: 'photo', // Use 'video' for video capture
            quality: 1, // 1 for high quality, 0 for low quality
        };

        try {
            launchCamera(options, async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled camera');
                } else if (response.error) {
                    Alert.alert(
                        'Alert!',
                        'Camera error: ', response.error,
                        [{
                            text: 'OK',
                            onPress: () => {
                                console.log('');
                            },
                        }],
                        { cancelable: false }
                    );
                    console.error('Camera error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else if (response.errorCode) {
                    Alert.alert(
                        'Alert!',
                        'Camera errorCode: ', response.errorCode,
                        [{
                            text: 'OK',
                            onPress: () => {
                            console.log('');
                            },
                        }],
                        { cancelable: false }
                    );
                    console.log('Camera error code: ', response.errorCode);
                } else {
                    const fileUri = response.assets[0].uri;
                    const fileContent = await RNFS.readFile(fileUri, 'base64');
                    
                    handleCredentials(sfileType, {
                        content: fileContent,
                        type: 'image',
                        name: response.assets[0].fileName,
                    });
                    handleSetUrl(sfileType, fileUri);
                    toggleFileTypeSelectModal();
                }
            });
        } catch (err) {
            Alert.alert(
                'Alert!',
                'Camera Issue: ' + JSON.stringify(err),
                [{
                    text: 'OK',
                    onPress: () => {
                        console.log('');
                    },
                }],
                { cancelable: false }
            );
        }
    };
      
    const pickGallery = async () => {
        const options = {
            mediaType: 'photo', // you can also use 'mixed' or 'video'
            quality: 1, // 0 (low) to 1 (high)
        };

        try {
            launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    Alert.alert(
                        'Alert!',
                        'ImagePicker Issue: ' + JSON.stringify(response.error),
                        [{
                            text: 'OK',
                            onPress: () => {
                            console.log('');
                            },
                        }],
                        { cancelable: false }
                    );
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.assets && response.assets.length > 0) {
                    const pickedImage = response.assets[0].uri;
                    const fileContent = await RNFS.readFile(pickedImage, 'base64');
                    
                    handleCredentials(sfileType, {
                        content: fileContent,
                        type: 'image',
                        name: response.assets[0].fileName,
                    });
                    handleSetUrl(sfileType, pickedImage);
                    toggleFileTypeSelectModal();
                } else {
                    Alert.alert(
                        'Alert!',
                        'ImagePicker Issue: ' + JSON.stringify(response),
                        [{
                            text: 'OK',
                            onPress: () => {
                            console.log('');
                            },
                        }],
                        { cancelable: false }
                    );
                }
            });
        } catch (err) {
            Alert.alert(
                'Alert!',
                'Camera Issue: ' + JSON.stringify(err),
                [{
                    text: 'OK',
                    onPress: () => {
                        console.log('');
                    },
                }],
                { cancelable: false }
            );
        }
    };
      
    const pickFile = async () => {
        try {
            let type = [DocumentPicker.types.images, DocumentPicker.types.pdf];
            const res = await DocumentPicker.pick({
                type: type,
            });
      
            const fileContent = await RNFS.readFile(res[0].uri, 'base64');
      
            let fileType;
            if (res[0].type === 'application/pdf') {
                fileType = 'pdf';
            } else if (res[0].type.startsWith('image/')) {
                fileType = 'image';
            } else {
                fileType = 'unknown';
            }

            if (res[0].uri.startsWith("content://")) {
                const targetPath = `${RNBlobUtil.fs.dirs.DocumentDir}/${res[0].name}`;

                RNBlobUtil.fs
                    .cp(uri, targetPath)
                    .then(() => {
                        handleSetUrl(sfileType, targetPath)
                    })
                    .catch((err) => {
                        console.error("Error copying file:", err);
                    });
            } else {
                handleSetUrl(sfileType, res[0].uri)
            }
            handleCredentials(sfileType, { content: `${fileContent}`, type: fileType, name: res[0].name });
            
            toggleFileTypeSelectModal();
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                // Handle other errors
            }
        }
    };

    const handleBack = () => {
        navigation.navigate('HospitalityAllContactors');
    };

    const handleShowFile = (data) => {
        navigation.navigate("UserFileViewer", { userId: id, filename: data });
    };
    
    const handleFileViewer = (target, data) => {
        let content = '';
        if (target == "resume") {
            content = resumeUrl;
        }

        if (content == "") {
            content = data.content;
        }
        navigation.navigate("FileViewer", { jobId: '', fileData: { name: data.name, type: data.type, content: content } });
    };

    const handleRemove = (target) => {
        if (target == "resume") {
            setResume({ content: '', name: '', type: '' });
            setResumeUpload(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent"/>
            <MHeader navigation={navigation} />
            <ScrollView style={{width: '100%', marginTop: height * 0.15}} showsVerticalScrollIndicator={false}>
                <View style={[styles.modal, { paddingHorizontal: '5%' }]}>
                    <View style={{flexDirection: 'row',  width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={[styles.profileTitleBg, { marginLeft: 0, marginTop: 30 }]}>
                            <Text style={[styles.profileTitle, { fontSize: RFValue(12) }]}>🖥️ CAREGIVER DOCUMENTS</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'column', width: '100%', gap: 10}} key={7}>
                        <Text style={{fontWeight: 'bold', fontSize: RFValue(16), lineHeight: 30, marginBottom: 5, backgroundColor: '#F7F70059'}}>Resume</Text>
                        {resume.name != "" && 
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={[styles.content, { lineHeight: 20, marginTop: 0, color: 'blue', width: 'auto' }]} 
                                    onPress={() => { 
                                        console.log(resume);
                                        if (resume.content != "") {
                                            handleFileViewer('resume', resume);
                                        } else {
                                            handleShowFile('resume');
                                        }
                                    }}
                                >{resume.name}</Text>
                                <Text style={{color: 'blue'}} onPress= {() => handleRemove('resume')}>&nbsp;&nbsp;remove</Text>
                            </View>
                        }
                        <View style={{flexDirection: 'row', width: '100%'}}>
                            <TouchableOpacity title="Select File" onPress={() => handleChangeFileType('resume')} style={styles.chooseFile}>
                                <Text style={{fontWeight: '400', padding: 0, fontSize: RFValue(14)}}>Choose File</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.input, {height: 30, width: '70%', color: 'black', paddingVertical: 5}]}
                                placeholder=""
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={resume.name || ''}
                            />
                        </View>
                        <View>
                        {resumeUpload && <TouchableOpacity title="Select File" onPress={() => handleSendFile('resume')} style={styles.saveFile}>
                            <Text style={styles.saveFileBtn}>Save</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>

                    <View style={[styles.line, { backgroundColor: '#ccc' }]}></View>

                    <View>
                        <Text style={{ textDecorationLine: 'underline', color: '#2a53c1', marginBottom: 20 }} onPress={handleBack} >
                            Back to 🏚️ All Contractors
                        </Text>
                    </View>
                </View>
                {fileTypeSelectModal && (
                    <Modal
                        visible={fileTypeSelectModal} // Changed from Visible to visible
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => {
                            setFiletypeSelectModal(false); // Close the modal
                        }}
                    >
                        <StatusBar translucent backgroundColor='transparent' />
                        <ScrollView style={styles.modalsContainer} showsVerticalScrollIndicator={false}>
                        <View style={[styles.viewContainer, { marginTop: '50%' }]}>
                            <View style={[styles.header, { height: 100 }]}>
                            <Text style={styles.headerText}>Choose File</Text>
                            <TouchableOpacity style={{ width: 20, height: 20 }} onPress={toggleFileTypeSelectModal}>
                                <Image source={images.close} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                            </View>
                            <View style={styles.body}>
                            <View style={[styles.modalBody, { marginBottom: 20 }]}>
                                <View style={styles.cameraContain}>
                                <TouchableOpacity activeOpacity={0.5} style={styles.btnSheet} onPress={openCamera}>
                                    <Image source={images.camera} style={{ width: 50, height: 50 }} />
                                    <Text style={styles.textStyle}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={styles.btnSheet} onPress={pickGallery}>
                                    <Image source={images.gallery} style={{ width: 50, height: 50 }} />
                                    <Text style={styles.textStyle}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={styles.btnSheet} onPress={pickFile}>
                                    <Image source={images.folder} style={{ width: 50, height: 50 }} />
                                    <Text style={styles.textStyle}>Folder</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                        </View>
                        </ScrollView>
                    </Modal>
                )}
            </ScrollView>
            <MFooter />
            <Loader visible={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
      borderRadius: 10,
      backgroundColor: 'red',
      padding: 20,
    },
    container: {
        flex: 1,
      marginBottom: 0,
      backgroundColor: 'rgba(155, 155, 155, 0.61))'
    },
    scroll: {
      marginTop: height * 0.15,
    },
    backTitle: {
      backgroundColor: 'black',
      width: '90%',
      height: 55,
      marginLeft: '5%',
      position: 'absolute',
      marginTop: 10,
      borderRadius: 10
    },
    content: {
        fontSize: RFValue(16),
        lineHeight: 30,
        width: '60%'
    },
    titles: {
        fontWeight: 'bold',
        fontSize: RFValue(16),
        lineHeight: 30,
        width: '35%'
    },
    line: {
        width: '100%',
        height: 5,
        marginVertical: 15
    },
    title: {
      fontSize: RFValue(20),
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10,
      marginLeft: '5%',
      padding: 15,
      width: '90%',
      backgroundColor: 'transparent'
    },
    marker: {
      width: 5,
      height: 5,
      borderRadius: 5,
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth: 1,
      marginRight: 10,
      marginTop: 17
    },
    text: {
      fontSize: RFValue(14),
      color: 'hsl(0, 0%, 29%)',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 24
    },
    modal: {
      width: '90%',
      borderRadius: 10,
      margin: '5%',
      marginBottom: 100,
      borderWidth: 1,
      borderColor: 'grey',
      overflow: 'hidden',
      shadowColor: 'black', // Shadow color
      shadowOffset: { width: 0, height: 10 }, // Shadow offset
      shadowOpacity: 0.1, // Shadow opacity
      shadowRadius: 3, // Shadow radius
      elevation: 0, // Elevation for Android devices
      backgroundColor: '#ffffffa8',
    },
    intro: {
      marginTop: 30,
      paddingHorizontal: 20,
      marginBottom: 20
    },
    input: {
        backgroundColor: 'white', 
        height: 40, 
        marginBottom: 10, 
        borderWidth: 1, 
        borderColor: 'hsl(0, 0%, 86%)',
    },
    saveFile: {
        width: 80, 
        height: 25, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: 'black'
    },
    saveFileBtn: {
        fontWeight: '400', 
        padding: 0, 
        fontSize: RFValue(9), 
        color: 'black',
    },
    chooseFile: {
        width: '30%', 
        height: 30, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: 'black',
    },
    subject: {
      padding: 5,
      backgroundColor: '#77f9ff9c',
      borderRadius: 2,
      borderColor: 'black',
      width: '80%',
      color: 'black',
      fontWeight: 'bold',
      marginTop: 30,
      marginLeft: '10%',
      fontSize: RFValue(18),
      borderRadius: 5,
    },
    mark: {
      width: '70%',
      height: 75,
      marginLeft: '15%',
    },
    homepage: {
      // paddingHorizontal: 30,
      // paddingVertical: 70,
      width: '45%',
      height: 130,
      marginTop: 10,
      marginLeft: '25%',
    },
    profileTitleBg: {
        backgroundColor: '#BC222F',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
        marginBottom: 20
    },
    profileTitle: {
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
      fontSize: RFValue(16),
      color: 'black',
      textAlign: 'left',
      paddingTop: 10,
      paddingBottom: 10,
      fontWeight: 'bold'
    },
    middleText: {
      fontSize: RFValue(16),
      margin: 0,
      lineHeight: 16,
      color: 'black'
    },
    authInfo: {
      marginLeft: 20,
      marginRight: 20,
    },
    buttonWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 130
    },
    btn: {
      flexDirection: 'column',
      gap: 20,
      marginBottom: 30,
    },
    subBtn: {
      marginTop: 0,
      padding: 10,
      backgroundColor: '#A020F0',
      color: 'white',
      fontSize: RFValue(16),
    },
    drinksButton: {
      fontSize: RFValue(18),
      padding: 15,
      borderWidth: 3,
      borderColor: 'white',
  
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    checkmark: {
      color: '#000',
    },
    signature: {
      flex: 1,
      width: '100%',
      height: 150,
    },
    chooseFile: {
      width: '30%',
      height: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      borderWidth: 1,
      borderColor: 'black'
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      elevation: 5,
      width: '60%',
      height: '30%',
      marginLeft: '20',
      flexDirection: 'column',
      justifyContent: 'space-around',
      padding: 20
    },
    modalsContainer: {
      paddingTop: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    viewContainer: {
      backgroundColor: '#f2f2f2',
      borderRadius: 30,
      elevation: 5,
      width: '90%',
      marginLeft: '5%',
      flexDirection: 'flex-start',
      borderWidth: 3,
      borderColor: '#7bf4f4',
      marginBottom: 100
    },
    modalBody: {
      backgroundColor: '#e3f2f1',
      borderRadius: 10,
      borderColor: '#c6c5c5',
      borderWidth: 2,
      paddingHorizontal: 20,
      paddingVertical: 20
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      height: '20%',
      padding: 20,
      borderBottomColor: '#c4c4c4',
      borderBottomWidth: 1,
    },
    headerText: {
      fontSize: RFValue(18),
      fontWeight: 'bold',
      color: 'black'
    },
    textStyle: {
      color: 'black'
    },
    closeButton: {
      color: 'red',
    },
    body: {
      marginTop: 10,
      paddingHorizontal:20,
    },
    cameraContain: {
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'row'
      },
    pressBtn:{
      top: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingRight: 10
    },
    btnSheet: {
        height: RFValue(80),
        width: RFValue(80),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        marginVertical: 14, padding: 5,
    },
});
  