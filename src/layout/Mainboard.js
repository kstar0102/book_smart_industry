import React from 'react';
import { View, Image, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import images from '../assets/images';
import MFooter from '../components/Mfooter';
import MHeader from '../components/Mheader';
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = 88; // adjust to match your MFooter height exactly

export default function Mainboard({ navigation }) {
  const handleHealthCare = () => {
    navigation.navigate('Home');
  };

  const handleHospitality = () => {
    navigation.navigate('HospitalityHomePage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <MHeader navigation={navigation} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
        keyboardDismissMode="on-drag"
        directionalLockEnabled
        showsVerticalScrollIndicator
        {...(Platform.OS === 'android' ? { overScrollMode: 'always' } : {})}
      >
        <Text style={styles.titleText}>
          Welcome to the {'\n'}BookSmart™ App
        </Text>
        <Text style={styles.text}>
          Where you make what you deserve!
        </Text>

        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleHospitality}>
              <Image
                source={images.hospital}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleHospitality}
            >
              <Text style={styles.buttonText}>HOSPITALITY</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleHealthCare}>
              <Image
                source={images.healthcare}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={{ height: RFValue(1.15) }} />
            <TouchableOpacity
              style={styles.button}
              onPress={handleHealthCare}
            >
              <Text style={styles.buttonText}>HEALTHCARE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <Image
              source={images.construction}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {}}
            >
              <Text style={styles.buttonText}>CONSTRUCTION</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />

        <Text style={styles.titleText}>
          Please click the icon {'\n'}for your industry
        </Text>

        {/* Spacer so content never sits behind the footer */}
        <View style={{ height: FOOTER_HEIGHT }} />
      </ScrollView>

      <MFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1, // instead of height: '100%'
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
    zIndex: -1,
    width : '100%',
    marginTop: 100
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 16, // ba
  },
  homepage: {
    width: width * 0.65,
    height: height * 0.25,
    marginTop: 30,
    resizeMode: 'cover'
  },
  text: {
    fontSize: RFValue(17),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  titleText: {
    fontSize: RFValue(24),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
  },
  iconWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',          // allow wrapping on small screens
    justifyContent: 'space-around',
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 16,          // space between wrapped rows
    flexBasis: '30%',          // help wrapping layout
    flexGrow: 0,
    flexShrink: 1,
  },
  iconImage: {
    width: width * 0.25,
    height: height * 0.15,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 5,
    paddingHorizontal: 0.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: RFValue(101),
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: RFValue(11),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
