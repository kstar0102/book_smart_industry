import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MFooter(props) {
  const theme = useTheme();

  const handleEmailPress = async () => {
    const emailUrl = 'mailto:support@booksmart.app';
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        console.log('Email URL is not supported');
      }
    } catch (error) {
      console.error('Error opening email URL:', error);
    }
  };
  

  const handleSMSPress = () => {
    const phoneUrl = 'sms:+18445582665';
    Linking.openURL(phoneUrl);
  };

  return (
    <View style={styles.shadow}>
      <View style={styles.bottomStyle}></View>
      <View style={{ marginTop: 5 }}>
        <View style={styles.supportRow}>
          <Text style={styles.generalText}>Support by Email:</Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.emailText}>
              support@booksmart.app
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportRow}>
          <Text style={styles.generalText}>Support by Text:</Text>
          <TouchableOpacity onPress={handleSMSPress}>
            <Text style={styles.smsText}>
              # 844.558.BOOK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  supportRow: {
    flexDirection: 'row',      // Aligns items horizontally
    justifyContent: 'center', // Align items to the start of the row
    alignItems: 'center',      // Align items vertically in the center
    marginBottom: 5,           // Adds some space between rows if needed
  },
  shadow: {
    borderRadius: 0,
    backgroundColor: '#290135',
    bottom: 0,
    width: '100%',
    position: 'absolute',
    paddingBottom: 13,
  },
  bottomStyle: {
    width: '100%',
    height: height * 0.007,
    backgroundColor: "#BC222F",
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
  generalText: {
    color: 'white',
    fontSize: RFValue(13.2),
    textAlign: 'center',
    fontWeight: '700',
    paddingHorizontal: 5,
    paddingVertical: 1,
    paddingTop: 2, // Ensures vertical alignment
  },
});
