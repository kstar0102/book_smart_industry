import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import Loader from '../../../Loader';
import { TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../../../assets/images';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MHeader from '../../../../components/Mheader';
import MFooter from '../../../../components/Mfooter';
import constStyles from '../../../../assets/styles';
import HButton from '../../../../components/Hbutton';
import { useAtom } from 'jotai';
import { aicAtom, firstNameAtom, lastNameAtom, companyNameAtom, contactPhoneAtom, AcknowledgementAtom, contactPasswordAtom, entryDateAtom, addressAtom,  contactEmailAtom, avatarAtom, userRoleAtom, passwordAtom } from '../../../../context/HotelHireProvider'
import { Signin } from '../../../../utils/useApi';

const { width, height } = Dimensions.get('window');

export default function HospitalityHotelHireSignIn({ navigation }) {
  const [loginEmail, setLoginEmail] =  useState('');
  const [loginPW, setLoginPW] = useState('');
  const [checked, setChecked] = useState(false);
  const [request, setRequest] = useState(false);

  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [companyName, setCompanyName] = useAtom(companyNameAtom);
  const [contactPhone, setContactPhone] = useAtom(contactPhoneAtom);
  const [contactPassword, setContactPassword] = useAtom(contactPasswordAtom);
  const [entryDate, setEntryDate] = useAtom(entryDateAtom);
  const [contactEmail, setContactEmail] = useAtom(contactEmailAtom);
  const [avatar, setAvatar] = useAtom(avatarAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [address, setAddress]= useAtom(addressAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [aic, setAIC] = useAtom(aicAtom);
  const [acknowledge, setAcknowledgeTerm] = useAtom(AcknowledgementAtom);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleToggle = async () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const getCredentials = async() => {
      const emails = (await AsyncStorage.getItem('hotelHireEmail')) || '';
      const password = (await AsyncStorage.getItem('hotelHirePSW')) || '';
      setLoginEmail(emails);
      setLoginPW(password);
    }
    getCredentials();
  }, []);

  const handleSignUpNavigate = () => {
    navigation.navigate('HospitalityHotelHireSignUp');
  };

  const handleSignInNavigate = (url) => {
    navigation.navigate(url);
  };

  const handleSignIn = async () => {
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
      const response = await Signin({ contactEmail: loginEmail, password: loginPW, userRole: 'hotelManager' }, 'hotel_manager');
      console.log(response);
      if (response?.user) {
        setRequest(false);
        setAIC(response?.user.aic);
        setFirstName(response?.user.firstName);
        setLastName(response?.user.lastName);
        setContactEmail(response?.user.contactEmail);
        setContactPassword(response?.user.contactPassword);
        setContactPhone(response?.user.contactPhone);
        setEntryDate(response?.user.entryDate);
        setCompanyName(response?.user.companyName);
        setAddress(response?.user.address);
        setAvatar(response?.user.avatar);
        setUserRole(response?.user.userRole);
        setPassword(response?.user.password);
        setAcknowledgeTerm(response?.user.Acknowledgement);

        await AsyncStorage.setItem('hotelHirePhoneNumber', response?.user.contactPhone);

        if (checked) {
          await AsyncStorage.setItem('hotelHireEmail', loginEmail);
          await AsyncStorage.setItem('hotelHirePSW', loginPW);
        }

        if (response.user.AcknowledgeTerm) {
          handleSignInNavigate('HospitalityHotelHireHome');
        } else {
          handleSignInNavigate('HospitalityHotelHireTerms');
        }
      } else {
        setRequest(false);
        if (response.error.status == 401) {
          Alert.alert(
            'Failed!',
            "Sign in information is incorrect.",
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
              source={images.hotel}
              resizeMode="contain"
              style={styles.mark}
            />
            <Image
              source={images.hospitality_icon}
              resizeMode="contain"
              style={styles.homepage}
            />

            <Text style={constStyles.loginMainTitle1}>WHERE STAFF COSTS YOU LESS!</Text>

            <Text style={{ fontSize: RFValue(16), fontWeight: '800', padding: RFValue(10), color: 'black'}}>HIRE</Text>

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
                value={loginPW || ''}
                secureTextEntry={isPasswordHidden}
                right={
                  <TextInput.Icon
                    icon={isPasswordHidden ? images.eye : images.eyeOff}
                    onPress={() => setIsPasswordHidden(h => !h)}
                    forceTextInputFocus={false}
                  />
                }
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
              <HButton style={constStyles.loginSubBtn} onPress={ handleSignIn }>
                Sign In
              </HButton>
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

  homepage: {
    width: width * 0.5,
    height: height * 0.25,
    marginTop: 10,
  },
  
  mark: {
    width: width * 0.65,
    height: height * 0.1,
    marginBottom: 20
  },
  
  authInfo: {
    marginLeft: 20,
    marginRight: 20,
  },

  btn: {
    flexDirection: 'row',
    marginBottom: RFValue(30),
    justifyContent : 'space-between'
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

