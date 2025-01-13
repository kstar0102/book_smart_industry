import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import MFooter from '../../../components/Mfooter';
import MHeader from '../../../components/Mheader';
import images from '../../../assets/images';

export default function HospitalityRestaurantDashboard({ navigation }) {
  const handleWork = () => {
    navigation.navigate('HospitalityRestaurantWorkLogin');
  };

  const handleHire = () => {
    navigation.navigate('HospitalityRestaurantHireLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <MHeader navigation={navigation} back={true}/>
      <Image
        source={images.hospitality_icon}
        style={styles.homepage}
        resizeMode="contain"
      />

      <Text style={styles.subheading}>Are you looking to work or hire?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleWork} style={styles.button}>
          <LinearGradient
            colors={['#A1E9F1', '#B980EC']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Work</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHire} style={styles.button}>
          <LinearGradient
            colors={['#A1E9F1', '#B980EC']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Hire</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <MFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: RFValue(24),
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  subheading: {
    fontSize: RFValue(16),
    textAlign: 'center',
    color: 'gray',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  homepage: {
    width: width * 0.65,
    height: height * 0.25,
    marginTop: 30,
    resizeMode: 'cover'
  },
});
