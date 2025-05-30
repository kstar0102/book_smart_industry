import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, 
  Alert, ScrollView, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import Loader from '../../../Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueId } from 'react-native-device-info';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../../../../assets/images';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
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
 } from '../../../../context/RestaurantWorkProvider';
import { useAtom } from 'jotai';
import { sendFCMToken, Signin } from '../../../../utils/useApi';

export default function HospitalityRestaurantWorkLogin({ navigation }) {
  const [device, setDevice] = useState('');
  const [loginEmail, setLoginEmail] =  useState('');
  const [loginPW, setLoginPW] = useState('');
  const [checked, setChecked] = useState(false);
  const [request, setRequest] = useState(false);

  const [aic, setAIC] = useAtom(aicAtom);
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [acknowledgeTerm, setAcknowledgeTerm] = useAtom(AcknowledgeTerm);
  const [fToken, setFToken] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const fetchDeviceInfo = async () => {
    try {
      const id = await getUniqueId();
      setDevice(id);
    } catch (error) {
      console.error('Error fetching device info:', error);
    }
  };

  const getFCMMsgToken = async () => {
    const token = await messaging().getToken();
    console.log("This is FCM Token => ", token);
    setFToken(token);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDeviceInfo();
    }, [])
  );

  useEffect(() => {
    const getCredentials = async() => {
      const emails = (await AsyncStorage.getItem('restaurantWorkEmail')) || '';
      const password = (await AsyncStorage.getItem('restaurantWorkPSW')) || '';
      setLoginEmail(emails);
      setLoginPW(password);
    }
    getCredentials();
    getFCMMsgToken();
  }, []);

  const handleToggle = async () => {
    setChecked(!checked);
  };

  const handleSignUpNavigate = () => {
    navigation.navigate('HospitalityRestaurantWorkSignup');
  };

  const handleSignInNavigate = (url) => {
    navigation.navigate(url);
  };

  const handleTermsNavigate = () => {
    navigation.navigate('HospitalityRestaurantWorkPemission');
  }

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
      const response = await Signin({ email: loginEmail, password: loginPW, device: device, userRole: 'RestaurantUser' }, 'restau_user');
      if (response?.user) {
        setRequest(false);
        setAIC(response.user.aic);
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setTitle(response.user.title);
        setPhoneNumber(response.user.phoneNumber);
        setUserRole(response.user.userRole);
        setAcknowledgeTerm(response.user.AcknowledgeTerm);
        setPassword(response.user.password);

        console.log(response.user.email, fToken);
        await sendFCMToken({ email: response.user.email, token: fToken }, 'restau_user');

        await AsyncStorage.setItem('restaurantWorkPhoneNumber', response.user.phoneNumber);

        if (checked) {
          await AsyncStorage.setItem('restaurantWorkEmail', loginEmail);
          await AsyncStorage.setItem('restaurantWorkPSW', loginPW);
        }

        if (response.user.AcknowledgeTerm) {
          // if (response.phoneAuth) {
          //   handleSignInNavigate('HospitalityRestaurantWorkPhone');
          // } else {
          //   handleSignInNavigate('HospitalityRestaurantWorkHome');
          // }
          handleSignInNavigate('HospitalityRestaurantWorkHome');
        } else {
          handleSignInNavigate('HospitalityRestaurantWorkPemission');
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
  }

  return (
    <View style={styles.container}>
      <MHeader navigation={navigation} back={true}/>
      <ScrollView style = {constStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.intro}>
            <Image
              source={images.restaurant}
              resizeMode="contain"
              style={styles.mark}
            />
            <Image
              source={images.hospitality_icon}
              resizeMode="contain"
              style={styles.homepage}
            />
            <Text style={{ fontSize: RFValue(16), fontWeight: '800', padding: RFValue(10), color: 'black'}}>WORK</Text>
            <Text style={[constStyles.loginSmallText, {marginHorizontal : RFValue(25), textAlign: 'center'}]}>
              Get the money you deserve by signing up and becoming a freelance contractor today!
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
              <HButton style={constStyles.loginSubBtn} onPress={ handleSubmit }>
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
    marginBottom: 20
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

  btn: {
    flexDirection: 'row',
    marginBottom: RFValue(30),
    justifyContent: 'space-between'
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

