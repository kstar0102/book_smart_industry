import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView, Pressable } from 'react-native';
import Loader from '../../../Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueId } from 'react-native-device-info';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../../../assets/images';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MHeader from '../../../../components/Mheader';
import MFooter from '../../../../components/Mfooter';
import HButton from '../../../../components/Hbutton';
import constStyles from '../../../../assets/styles';
import { 
  firstNameAtom, 
  lastNameAtom, 
  emailAtom, 
  titleAtom, 
  userRoleAtom, 
  phoneNumberAtom,
  passwordAtom,
  aicAtom,
  AcknowledgeTerm
 } from '../../../../context/HotelWorkProvider';
import { useAtom } from 'jotai';
import { Signin } from '../../../../utils/useApi';

const { width, height } = Dimensions.get('window');

export default function HospitalityHotelWorkSignIn({ navigation }) {
  const [aic, setAIC] = useAtom(aicAtom);
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [acknowledge, setAcknowledgeTerm] = useAtom(AcknowledgeTerm);

  const [device, setDevice] = useState('');
  const [loginEmail, setLoginEmail] =  useState('');
  const [loginPW, setLoginPW] = useState('');
  const [checked, setChecked] = useState(false);
  const [request, setRequest] = useState(false);

  const fetchDeviceInfo = async () => {
    try {
      const id = await getUniqueId();
      setDevice(id);
    } catch (error) {
      console.error('Error fetching device info:', error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      fetchDeviceInfo();
    }, [])
  );
  
  const handleToggle = async () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const getCredentials = async() => {
      const emails = (await AsyncStorage.getItem('hotelWorkEmail')) || '';
      const password = (await AsyncStorage.getItem('hotelWorkPassword')) || '';
      setLoginEmail(emails);
      setLoginPW(password);
    }
    getCredentials();
  }, []);

  const handleSignUpNavigate = () => {
    navigation.navigate('HospitalityHotelWorkSignUp');
  };

  const handleSignInNavigate = (url) => {
    navigation.navigate(url);
  };

  const handleSubmit = async () => {
    if (loginEmail == "") {
      Alert.alert(
        'Warning!',
        "Please enter your email",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK pressed')
            },
          },
        ],
        { cancelable: false }
      );
      return;
    }

    if (loginPW == "") {
      Alert.alert(
        'Warning!',
        "Please enter password",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK pressed')
            },
          },
        ],
        { cancelable: false }
      );
      return;
    }

    try {
      setRequest(true);
      const response = await Signin({ email: loginEmail, password: loginPW, device: device, userRole: 'hotelWorker' }, 'hotel_user');
      if (response?.user) {
        setRequest(false);
        setAIC(response.user.aic);
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setTitle(response.user.title);
        setPhoneNumber(response.user.phoneNumber);
        setUserRole(response.user.userRole);
        setPassword(response.user.password);
        setAcknowledgeTerm(response.user.AcknowledgeTerm);

        await AsyncStorage.setItem('hotelWorkPhoneNumber', response.user.phoneNumber);

        if (checked) {
          await AsyncStorage.setItem('hotelWorkEmail', loginEmail);
          await AsyncStorage.setItem('hotelWorkPassword', loginPW);
        }

        if (response.user.AcknowledgeTerm) {
          if (response.phoneAuth) {
            // handleSignInNavigate('ClientPhone');
          } else {
            handleSignInNavigate('HospitalityHotelWorkHome');
          }
        } else {
          handleSignInNavigate('HospitalityHotelWorkTerms');
        }
      } else {
        setRequest(false);
        if (response.error.status == 401) {
          Alert.alert(
            'Failed!',
            "Sign in informaation is incorrect.",
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK pressed')
                },
              },
            ],
            { cancelable: false }
          );
        } else if (response.error.status == 402) {
          Alert.alert(
            'Failed!',
            "You are not approved! Please wait.",
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK pressed')
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Failed!',
            "User Not Found! Please Register First.",
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK pressed')
                },
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      setRequest(false);
      console.log('SignIn failed: ', JSON.stringify(error))
      Alert.alert(
        'Failed!',
        "Network Error",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK pressed')
            },
          },
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <View style={styles.container}>
      <MHeader navigation={navigation} back={true}/>
      <ScrollView style = {styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.intro}>
            <Image
              source={images.mark}
              resizeMode="contain"
              style={styles.mark}
            />
            <Text style={constStyles.loginMainTitle}>WHY BOOK DUMB?</Text>
            <Image
              source={images.hospitality_icon}
              resizeMode="contain"
              style={styles.homepage}
            />
            <Text style={constStyles.loginSmallText}>Let your licensure and certifications pay off. {'\n'}
              Get the money you deserve by signing up {'\n'}
              and becoming a freelance clinician today!
            </Text>

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
                    onPress={() => navigation.navigate('HospitalityRestaurantWorkForgot')}>
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
              {/* <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <LinearGradient
                  colors={['#A1E9F1', '#B980EC']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity> */}

              <HButton style={constStyles.loginSubBtn} onPress={ handleSubmit }>
                Sign In
              </HButton>
             
              <View style = {{marginTop : RFValue(20)}}/>
              <Text style={constStyles.loginMiddleText}>Need an account?</Text>
              <View style = {{marginTop : RFValue(5)}}/>

              {/* <TouchableOpacity onPress={handleSignUpNavigate} style={styles.button}>
                <LinearGradient
                  colors={['#A1E9F1', '#B980EC']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Sign up</Text>
                </LinearGradient>
              </TouchableOpacity> */}

              <HButton style={constStyles.loginSubBtn} onPress={ handleSignUpNavigate }>
                Sign Up
              </HButton>
            </View>
          </View>
        </View>
        <View style={constStyles.signInButtonWrapper}>
          <HButton
            onPress={() => navigation.navigate('AdminLogin')}
            style={[constStyles.hospitalityAdminButtion, { fontSize: RFValue(12) }]}>
            Admin Login
          </HButton>
        </View>
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

  mark: {
    width: width * 0.65,
    height: height * 0.1,
    marginLeft: '15%',
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
