import React from 'react';
import { View, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import images from '../../../../assets/images';
import MFooter from '../../../../components/Mfooter';
import MHeader from '../../../../components/Mheader';
import SubNavbar from '../../../../components/SubNavbar';
import ImageButton from '../../../../components/ImageButton';
import AnimatedHeader from '../../../AnimatedHeader';
import { firstNameAtom, lastNameAtom, emailAtom, userRoleAtom, titleAtom } from '../../../../context/RestaurantWorkProvider';
import { useAtom } from 'jotai';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function HospitalityRestaurantWorkHome ({ navigation }) {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);

  const handleNavigate = (navigateUrl) => {
    navigation.navigate(navigateUrl);
  };

  const userInfo = [
    {title: 'Name', content: firstName + ' ' + lastName},
    {title: 'Email', content: email},
    {title: 'User Roles', content: "Restaurant - " + titleAtom},
  ];

  return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent"/>
        <MHeader navigation={navigation} />
        <SubNavbar navigation={navigation} name={'HospitalityRestaurantWorkLogin'}/>
        <ScrollView style={{width: '100%', marginTop: height * 0.22}} showsVerticalScrollIndicator={false}>
          <View style={styles.topView}>
            <TouchableOpacity onPress={() => navigation.navigate("HospitalityRestaurantWorkBookShift")}>
              <AnimatedHeader title="Restaurant Book Shifts Now!" style={{ paddingHorizontal: 30 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.imageButton}>
            <ImageButton title={"My Profile"} onPress={() => handleNavigate('HospitalityRestaurantWorkEditProfile')} />
            <ImageButton title={"Electronic Timesheet"} onPress={() => handleNavigate('HospitalityRestaurantWorkTimesheetForm')} />
            <ImageButton title={"My Shifts"} onPress={() => handleNavigate('HospitalityRestaurantWorkMyShift')} />
            <ImageButton title={"My Reporting"} onPress={() => handleNavigate('HospitalityRestaurantWorkReporting')} />
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
              source={images.hospitality_icon}
              resizeMode="contain"
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
  
});
