import React from 'react';
import { View, StyleSheet, Text, PixelRatio } from 'react-native';
import { Card } from 'react-native-paper';
import { useAtom } from 'jotai';
import { firstNameAtom as clinicalFirstNameAtom } from '../context/ClinicalAuthProvider';
import { firstNameAtom as adminFirstNameAtom } from '../context/AdminAuthProvider';
import { firstNameAtom as facilityFirstNameAtom } from '../context/FacilityAuthProvider';
import { firstNameAtom as restaurantWorkFirstNameAtom } from '../context/RestaurantWorkProvider';
import { firstNameAtom as restaurantHireFirstNameAtom } from '../context/RestaurantHireProvider';
import { firstNameAtom as hotelHireFirstNameAtom } from '../context/HotelHireProvider';
import { firstNameAtom as hotelWorkFirstNameAtom } from '../context/HotelWorkProvider';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const pixelRatio = PixelRatio.getFontScale();

export default function SubNavbar({name, navigation}) {
  let userRole = 'clinical';
  if (name === "ClientSignIn") userRole = 'clinical';
  else if (name === "AdminLogin") userRole = 'admin';
  else if (name === "FacilityLogin") userRole = 'facilities';
  else if (name === "HospitalityRestaurantWorkLogin") userRole = 'restaurantWork';
  else if (name === "HospitalityRestaurantHireLogin") userRole = 'restaurantManager';
  else if (name === "HospitalityHotelHireSignIn") userRole = 'hotelManager';
  else if (name === "HospitalityHotelWorkSignIn") userRole = 'hotelWorker';

  const [firstName, setFirstName] = useAtom(userRole === 'clinical' ? clinicalFirstNameAtom : userRole === 'admin' ? adminFirstNameAtom : userRole === 'facilities' ? facilityFirstNameAtom : userRole === 'restaurantManager' ? restaurantHireFirstNameAtom : userRole === 'hotelManager' ? hotelHireFirstNameAtom : userRole === 'hotelWorker' ? hotelWorkFirstNameAtom : restaurantWorkFirstNameAtom);
  
  const handleNavigate = (navigateUrl) => {
    navigation.navigate(navigateUrl, {userRole: userRole});
  };

  return (
    <Card style={styles.shadow}>
      <View>
        <Text style={{color: "black", fontSize: pixelRatio > 1 ? RFValue(8) : RFValue(14)}}>
          Logged in as&nbsp;
          <Text style={{fontWeight: 'bold', color:"black", fontSize: pixelRatio > 1 ? RFValue(8) : RFValue(14)}}>{firstName}</Text>&nbsp;-&nbsp;
          <Text 
            style={{
              color: '#2a53c1', 
              textDecorationLine: 'underline',
              fontSize: pixelRatio > 1 ? RFValue(8) : RFValue(14)
            }}
            onPress={()=>handleNavigate('AccountSettings')}
          >
            Account Settings
          </Text>
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <Text 
            style={{
              color: '#2a53c1', 
              textDecorationLine: 'underline',
              fontSize: pixelRatio > 1 ? RFValue(8) : RFValue(14)
            }}
            onPress={()=>handleNavigate(name)}>
            Log Out
          </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: 'hsl(0, 0%, 80%)',
    position: 'absolute',
    top: height * 0.15,
    height: height * 0.07,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: RFValue(10),
    paddingVertical: pixelRatio > 1 ? RFValue(0) : RFValue(5)
  },
  actionsContainer: {
    width: '100%',
    marginTop: RFValue(2),
    flexDirection: 'column',
    alignItems: 'flex-end',
  }
});
