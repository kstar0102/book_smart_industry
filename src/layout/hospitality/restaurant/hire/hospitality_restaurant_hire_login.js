import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../../Loader';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../../../assets/images';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import MHeader from '../../../../components/Mheader';
import MFooter from '../../../../components/Mfooter';
import constStyles from '../../../../assets/styles';
import HButton from '../../../../components/Hbutton';
export default function HospitalityRestaurantHireLogin({ navigation }) {
  const [device, setDevice] = useState('');
  const [loginEmail, setLoginEmail] =  useState('');
  const [loginPW, setLoginPW] = useState('');
  const [checked, setChecked] = useState(false);
  const [request, setRequest] = useState(false);


  const handleToggle = async () => {
    setChecked(!checked);
  };

  const handleSignUp = () => {
    navigation.navigate('HospitalityRestaurantHireSignUp');
  };

  const handleSignIn = () => {
    navigation.navigate('HospitalityRestaurantHireHome');
  };

  return (
    <View style={styles.container}>
      <MHeader navigation={navigation} back={true}/>
      <ScrollView style = {styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.intro}>

            <Image
              source={images.hospitality_icon}
              resizeMode="contain"
              style={styles.homepage}
            />

            <Text style={constStyles.loginMainTitle1}>WHERE CARE MEETS CONNECTION</Text>

            <HButton
              style={constStyles.loginMainButton}>
              HIRE
            </HButton>

            <Text style={[constStyles.loginSubTitle, { color: '#2a53c1', width: '90%', textAlign: 'center', fontSize: RFValue(14)}]}>Register or Enter your email address and password to login.</Text>

          </View>
          <View style={styles.authInfo}>
            <View style={styles.email}>
              <Text style={constStyles.loginSubTitle}> Email Address </Text>
              <TextInput
                style={constStyles.loginTextInput}
                placeholder=""
                onChangeText={e => setLoginEmail(e)}
                value={loginEmail || ''}
              />
            </View>
            <View style={styles.password}>
              <View style={{flexDirection: 'row', alignItems: 'bottom'}}>
                <Text style={constStyles.loginSubTitle}> Password </Text>
                <TouchableOpacity
                  onPress={() => console.log('Navigate to forget password')}>
                  <Text
                    style={[constStyles.loginSubTitle, { color: '#2a53c1'}]}
                    onPress={() => navigation.navigate('HospitalityRestaurantHireForgot')}>
                    {'('}forgot?{')'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={constStyles.loginTextInput}
                placeholder=""
                onChangeText={e => setLoginPW(e)}
                secureTextEntry={true}
                value={loginPW || ''}
              />
              <Pressable 
                onPress={handleToggle}
                style={constStyles.loginCheckBox}>
                <View style={styles.checkbox}>
                  {checked && <Text style={constStyles.logincheckmark}>✓</Text>}
                </View>
                <Text style={constStyles.loginMiddleText}>Remember me</Text>
              </Pressable>
            </View>

            <View style={styles.btn}>
              <TouchableOpacity onPress={handleSignIn} style={styles.button}>
                <LinearGradient
                  colors={['#A1E9F1', '#B980EC']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
             
              <View style = {{marginTop : RFValue(20)}}/>
              <Text style={constStyles.loginMiddleText}>Need an account?</Text>
              <View style = {{marginTop : RFValue(5)}}/>

              <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                <LinearGradient
                  colors={['#A1E9F1', '#B980EC']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Sign up</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style = {{height : RFValue(55)}}/>
      </ScrollView>
      <Loader visible={request}/>
      <MFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '55%',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  
  gradientButton: {
    height: RFValue(40), // Adjust the button height here
    paddingVertical: 0, // Remove padding to maintain consistent height
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For shadow on Android
  },

  container: {
    marginBottom: 0,
  },

  scroll: {
    marginTop: height * 0.15,
  },

  modal: {
    width: '90%',
    borderRadius: 10,
    margin: '5%',
    borderWidth: 1,
    borderColor: 'grey',
    overflow: 'hidden',
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 3, // Shadow radius
    elevation: 0, // Elevation for Android devices
  },

  intro: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30
  },

  homepage: {
    width: width * 0.5,
    height: height * 0.25,
    marginTop: 10,
  },
  
  authInfo: {
    marginLeft: 20,
    marginRight: 20,
  },

  btn: {flexDirection: 'column',
    marginBottom: RFValue(30),
  },
  
  checkbox: {
    width: RFValue(20),
    height: RFValue(20),
    borderWidth: RFValue(1),
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
  },
  
});

