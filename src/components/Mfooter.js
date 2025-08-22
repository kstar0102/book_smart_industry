import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MFooter(props) {
  const theme = useTheme();

  const handleEmailPress = () => {
    const emailUrl = 'mailto:support@booksmart.app';
    Linking.openURL(emailUrl);
  };

  const handleSMSPress = () => {
    const phoneUrl = 'sms:+18445582665';
    Linking.openURL(phoneUrl);
  };

  return (
    <View style={styles.shadow}>
      <View style={styles.bottomStyle}></View>
      <Text style={styles.text}>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.emailText}>Support by Email: support@booksmart.app</Text>
        </TouchableOpacity>
        {'\n'}
        <TouchableOpacity onPress={handleSMSPress}>
          <Text style={styles.smsText}>Support by Text: # 844.558.BOOK</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: '#290135',
    bottom: 0,
    width: '100%',
    position: 'absolute',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    color: 'white',
    fontSize: RFValue(13),
    textAlign: 'center',
    fontWeight: '700',
  },
  bottomStyle: {
    width: '100%',
    height: height * 0.007,
    backgroundColor: "#BC222F"
  },
  emailText: {
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: RFValue(13.2),
    textAlign: 'center',
    fontWeight: '700',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  smsText: {
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: RFValue(13.2),
    textAlign: 'center',
    fontWeight: '700',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  logo: {
    width: 70,
    height: 59,
  },
});
