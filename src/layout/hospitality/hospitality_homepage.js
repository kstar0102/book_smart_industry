import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../assets/images';
import { Dimensions } from 'react-native';
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import HButton from '../../components/Hbutton';
import constStyles from '../../assets/styles';
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
      <Text style={styles.text}>
        Welcome to the BookSmart™ App
      </Text>
      <Text style={styles.text}>
        Where you get what you deserve!
      </Text>
      
      <Image
        source={images.hospitality_icon}
        style={constStyles.homeImageStyle}
        resizeMode="contain"
      />

      <View style = {{height: RFValue(50)}}></View>
      <Text style={constStyles.dashboardsubheading}>Select Your Industry:</Text>
      <View style={constStyles.dashboardbuttonWrapper}>
        <HButton style={constStyles.dashboardbutton} onPress={ handleRestaurant }>
          Restaurant
        </HButton>

        <HButton style={constStyles.dashboardbutton} onPress={ handleHotel }>
          Hotel
        </HButton>
      </View>
        {/* <TouchableOpacity onPress={handleRestaurant} style={styles.button}>
          <LinearGradient
            colors={['#A1E9F1', '#B980EC']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Restaurant</Text>
          </LinearGradient>
        </TouchableOpacity> */}
        
        {/* <TouchableOpacity onPress={handleHotel} style={styles.button}>
          <LinearGradient
            colors={['#A1E9F1', '#B980EC']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Hotel</Text>
          </LinearGradient>
        </TouchableOpacity> */}
      
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
  // gradientButton: {
  //   paddingVertical: 15,
  //   borderRadius: 25,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 5, // For shadow on Android
  // },
  // buttonText: {
  //   fontSize: 16,
  //   color: '#FFFFFF',
  //   fontWeight: 'bold',
  // },
  
  text: {
    fontSize: RFValue(17),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
