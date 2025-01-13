import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../assets/images';
import { Dimensions } from 'react-native';
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
const { width, height } = Dimensions.get('window');

export default function HospitalityHomePage({ navigation }) {
  const handleRestaurant = () => {
    navigation.navigate('HospitalityRestaurantDashboard');
  };

  const handleHotel = () => {
    navigation.navigate('HospitalityHotelDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <MHeader navigation={navigation} back={true}/>
      <Text style={styles.title}>Hospitality{'\n'}Home Page</Text>
      
      <Image
        source={images.hospitality_icon}
        style={styles.homepage}
        resizeMode="contain"
      />

      <View style = {{height: RFValue(50)}}></View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRestaurant} style={styles.button}>
          <LinearGradient
            colors={['#A1E9F1', '#B980EC']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Restaurant</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHotel} style={styles.button}>
          <LinearGradient
            colors={['#A1E9F1', '#B980EC']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Hotel</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <MFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  title: {
    fontSize: RFValue(24),
    textAlign: 'center',
    color: 'black',
    marginBottom: 50,
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
    elevation: 5, // For shadow on Android
  },
  buttonText: {
    fontSize: 16,
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
