import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function HospitalityHomePage({ navigation }) {
  const handleRestaurant = () => {
    console.log('Restaurant button pressed'); // Replace with navigation.navigate('RestaurantPage') if needed
  };

  const handleHotel = () => {
    console.log('Hotel button pressed'); // Replace with navigation.navigate('HotelPage') if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hospitality{'\n'}Home Page</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRestaurant} style={styles.button}>
          <LinearGradient
            colors={['#A1C4FD', '#C2E9FB']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Restaurant</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHotel} style={styles.button}>
          <LinearGradient
            colors={['#A1C4FD', '#C2E9FB']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Hotel</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
