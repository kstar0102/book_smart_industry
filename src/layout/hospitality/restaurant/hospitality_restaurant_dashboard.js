import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import MFooter from '../../../components/Mfooter';
import MHeader from '../../../components/Mheader';
import HButton from '../../../components/Hbutton';
import constStyles from '../../../assets/styles';
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
        style={constStyles.homeImageStyle}
        resizeMode="contain"
      />

      <Text style={constStyles.dashboardsubheading}>Are you looking to work or hire?</Text>
      <View style={constStyles.dashboardbuttonWrapper}>
        <HButton style={constStyles.dashboardbutton} onPress={ handleWork }>
          Work
        </HButton>

        <HButton style={constStyles.dashboardbutton} onPress={ handleHire }>
          Hire
        </HButton>
      </View>
      {/* <View style={styles.buttonContainer}>
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
      </View> */}
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
});
