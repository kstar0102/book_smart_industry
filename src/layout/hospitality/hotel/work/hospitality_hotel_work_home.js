import React from 'react';
import { View, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import images from '../../../../assets/images';
import MFooter from '../../../../components/Mfooter';
import MHeader from '../../../../components/Mheader';
import SubNavbar from '../../../../components/SubNavbar';
import ImageButton from '../../../../components/ImageButton';
import { useAtom } from 'jotai';
import { 
    firstNameAtom, 
    lastNameAtom, 
    emailAtom,
    titleAtom,
    userRoleAtom} from '../../../../context/HotelWorkProvider';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from 'react-native';
import AnimatedHeader from '../../../AnimatedHeader';

const { width, height } = Dimensions.get('window');

export default function HospitalityHotelWorkHome ({ navigation }) {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  
  const handleNavigate = (navigateUrl) => {
    navigation.navigate(navigateUrl);
  };

  const userInfo = [
    {title: 'Name', content: firstName + ' ' + lastName},
    {title: 'Email', content: email},
    {title: 'User Roles', content: "Hotel - " + title},
    // {title: 'Caregiver', content: caregiver},
  ];

  return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent"/>
        <MHeader navigation={navigation} />
        <SubNavbar navigation={navigation} name={'HospitalityHotelWorkSignIn'}/>
        <ScrollView style={{width: '100%', marginTop: height * 0.22}} showsVerticalScrollIndicator={false}>
          <View style={styles.topView}>
            {/* <Image
              source={images.mark}
              resizeMode="contain"
              style={styles.mark}
            />
            <View style={styles.bottomBar}/> */}
            <TouchableOpacity onPress={() => navigation.navigate("HospitalityHotelWorkBookShift")}>
              <AnimatedHeader title="Book Shifts Now!" style={{ paddingHorizontal: 30 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.imageButton}>
            <ImageButton title={"My Profile"} onPress={() => handleNavigate('HospitalityHotelWorkProfile')} />
            <ImageButton title={"Electronic Timesheet"} onPress={() => handleNavigate('TimesheetForm')} />
            <ImageButton title={"My Shifts"} onPress={() => handleNavigate('HospitalityHotelWorkMyShift')} />
            <ImageButton title={"My Reporting"} onPress={() => handleNavigate('HospitalityHotelWorkReporting')} />
          </View>
          <View style={{ flex:1, justifyContent: 'center', width: '100%', alignItems: 'center' }}>
            <View style={styles.profile}>
              {
                userInfo.map((item, index) => 
                  <View key={index} style={{flexDirection: 'row'}}>
                    <Text style={[
                      styles.content, 
                      item.title == "Name" ? {fontWeight: 'bold'} : 
                      item.title == "Email" ? {color: '#2a53c1', textDecorationLine:'underline'} : {}
                    ]}>{item.content}</Text>
                  </View>
                )
              }
            </View>
            <Image
              source={images.homepage}
              resizeMode="cover"
              style={styles.homepage}
            />
          </View>
        </ScrollView>
        <MFooter />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },
  topView: {
    marginTop: RFValue(5),
    marginLeft: '10%',
    width: '80%',
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center'
  },
  mark: {
    width: width * 0.65,
    height: height * 0.1,
    marginBottom: RFValue(30)
  },
  bottomBar: {
    height: RFValue(5),
    backgroundColor: '#C0D1DD',
    width: '100%'
  },
 
  imageButton: {
    width: '90%',
    marginLeft: '5%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RFValue(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(30),
    marginLeft: '5%'
  },
  homepage: {
    width: RFValue(250),
    height: RFValue(200),
    marginTop: RFValue(30),
    marginBottom: RFValue(100)
  },
  profile: {
    marginTop: RFValue(20),
    width: '84%',
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(5),
    backgroundColor: '#c2c3c42e',
    borderRadius: RFValue(30),
    borderWidth: RFValue(2),
    borderColor: '#b0b0b0',
  },
  content: {
    fontSize: RFValue(16),
    lineHeight: RFValue(30),
  },
  headBar: {
    textAlign: 'center',
    backgroundColor: '#BC222F',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: RFValue(18),
    fontWeight: 'bold'
  },
});
