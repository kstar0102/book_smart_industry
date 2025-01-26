import React from 'react';
import {View, Image, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import images from '../assets/images';
import MFooter from '../components/Mfooter';
import MHeader from '../components/Mheader';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Mainboard ({ navigation }) {

  const handleHealthCare = () => {
    navigation.navigate('Home');
  };

  const handleHospitality = () => {
    navigation.navigate('HospitalityHomePage');
  };

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar  translucent backgroundColor="transparent" />
      <MHeader navigation={navigation} />
      <Text style={styles.titleText}>
        Welcome to the {'\n'}BookSmart™ App
      </Text>
      <Text style={styles.text}>
        Where you make what you deserve!
      </Text>
      <View style={styles.iconWrapper}>
        <View style={styles.iconContainer}>
          <Image
            source={images.hospital}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleHospitality}
          >
            <Text style={styles.buttonText}>HOSPITALITY</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <Image
            source={images.healthcare} // Replace with healthcare image
            style={styles.iconImage}
            resizeMode="contain"
          />
          <View style = {{height : RFValue(1.15)}}/>
          <TouchableOpacity
            style={styles.button}
            onPress={handleHealthCare}
          >
            <Text style={styles.buttonText}>HEALTHCARE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <Image
            source={images.construction} // Replace with construction image
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
      <View style = {{height: 30}} />
      <Text style={styles.titleText}>
        Please click the icon {'\n'}for your industry
      </Text>
      <MFooter />
    </SafeAreaView >
  )
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
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
    marginTop: 10,
  },
  iconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 1,
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
    backgroundColor: '#D32F2F', // Red background color
    paddingVertical: 5, // Vertical padding for height
    paddingHorizontal: 0.5, // Horizontal padding for width
    borderRadius: 4, // Slightly rounded corners
    alignItems: 'center', // Center align text horizontally
    justifyContent: 'center', // Center align text vertically
    width: RFValue(101), // Set fixed width
    marginTop: 10, // Add spacing between buttons if needed
  },

  buttonText: {
    color: 'white', // White text color
    fontSize: RFValue(11), // Font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center-align text
  },
});
  