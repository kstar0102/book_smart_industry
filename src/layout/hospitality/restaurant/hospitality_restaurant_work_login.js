import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

export default function HospitalityRestaurantWorkLogin() {
  const handleSignIn = () => {
    console.log('Sign In button pressed'); // Add login logic here
  };

  const handleSignUp = () => {
    console.log('Sign Up button pressed'); // Add sign-up navigation or logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Restaurant{'\n'}if "Work" button is selected</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.textInput} placeholder="Enter your email" keyboardType="email-address" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  heading: {
    fontSize: RFValue(24),
    textAlign: 'center',
    color: 'black',
    marginBottom: 30,
  },
  inputContainer: {
    width: '80%',
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
    height: RFValue(45),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: RFValue(14),
  },
  button: {
    width: '50%',
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 15,
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
    color: 'gray',
    marginBottom: 10,
  },
});
