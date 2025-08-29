import React from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, ScrollView, Dimensions, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../assets/images';
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import HButton from '../../components/Hbutton';
import constStyles from '../../assets/styles';

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = 88; // adjust to match your actual MFooter height

export default function HospitalityHomePage({ navigation }) {
  const handleRestaurant = () => navigation.navigate('HospitalityRestaurantDashboard');
  const handleHotel = () => navigation.navigate('HospitalityHotelDashboard');

  return (
    <SafeAreaView style={styles.container}>
      <MHeader navigation={navigation} back={false} />

      {/* Make the main area scrollable */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
        directionalLockEnabled
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator
        {...(Platform.OS === 'android' ? { overScrollMode: 'always' } : {})}
      >
        <Text style={styles.text}>Welcome to BookSmart™ Hospitality</Text>
        <Text style={styles.text}>Where you get what you deserve!</Text>

        <View style={{ height: RFValue(12) }} />

        <Image
          source={images.hospitality_icon}
          style={constStyles.homeImageStyle}
          resizeMode="contain"
        />

        <View style={{ height: RFValue(18) }} />

        <Text style={constStyles.dashboardsubheading}>Select Your Industry:</Text>

        <View style={constStyles.dashboardbuttonWrapper}>
          <HButton style={constStyles.dashboardbutton} onPress={handleRestaurant}>
            Restaurant
          </HButton>

          <HButton style={constStyles.dashboardbutton} onPress={handleHotel}>
            Hotel
          </HButton>
        </View>

        {/* Spacer so content never hides behind the footer */}
        <View style={{ height: FOOTER_HEIGHT }} />
      </ScrollView>

      <MFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // was height: '100%'; flex is safer with scroll
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
    marginTop : height * 0.15
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,          // base padding; spacer handles exact footer gap
  },
  text: {
    fontSize: RFValue(16),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
