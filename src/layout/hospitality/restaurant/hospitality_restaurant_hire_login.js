import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../../assets/images';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import MHeader from '../../../components/Mheader';
import MFooter from '../../../components/Mfooter';

export default function HospitalityRestaurantHireLogin({ navigation }) {
  const handleSignIn = () => {
    console.log('Sign In button pressed'); // Add login logic here
  };

  const handleSignUp = () => {
    navigation.navigate('HospitalityRestaurantHireSignup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <MHeader navigation={navigation} back={true}/>
      <Image
        source={images.hospitality_icon}
        style={styles.imageHospitality}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="Enter your email" 
          keyboardType="email-address" 
        />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.textInput} placeholder="Enter your password" secureTextEntry />
      </View>

      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <LinearGradient
          colors={['#A1E9F1', '#B980EC']}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.signupPrompt}>Need an account?</Text>
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <LinearGradient
          colors={['#A1E9F1', '#B980EC']}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </LinearGradient>
      </TouchableOpacity>
      <MFooter navigation={navigation} />
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
    marginBottom: 30,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 30,
  },
  label: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    height: RFValue(40),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: RFValue(14),
    paddingVertical: 0,
    textAlignVertical: 'center',

  },
  button: {
    width: '40%',
    marginBottom: 10,
    alignSelf: 'flex-start',
    left: RFValue(20), // Adjust the `left` value as needed
  },
  gradientButton: {
    height: RFValue(35), // Adjust the button height here
    paddingVertical: 0, // Remove padding to maintain consistent height
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For shadow on Android
  },
  buttonText: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  signupPrompt: {
    fontSize: RFValue(14),
    color: 'black',
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'flex-start',
    left: RFValue(20), // Adjust the `left` value as needed
  },
  imageHospitality: {
    width: width * 0.65,
    height: height * 0.25,
    marginTop: 30,
    resizeMode: 'cover'
  },
});

