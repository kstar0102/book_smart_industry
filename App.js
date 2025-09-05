import React, { useEffect } from 'react';
import { StyleSheet, Platform, PermissionsAndroid, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import { getMessaging } from '@react-native-firebase/messaging';
import '@react-native-firebase/app'; 

import Layout from './src/layout/Layout';
// import BackgroundTask from './src/utils/backgroundTask';

export default function App() {
  useEffect(() => {
    let unsubscribe = () => {};

    const initFCM = async () => {
      // For Android devices, request permission if it's Android 13+ (API 33)
      if (Platform.OS === 'android') {
        console.log("Android platform detected");

        // Android 13+ (API level 33) requires POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          console.log("Android 13+ detected, requesting notification permission...");
          const permissionGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          // If permission isn't granted, request it
          if (!permissionGranted) {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('Permission Denied', 'Notification permission is required.');
            } else {
              console.log("Notification permission granted.");
            }
          } else {
            console.log("Notification permission already granted.");
          }
        } else {
          console.log("Android version less than 33, no need for POST_NOTIFICATIONS permission.");
        }
      }

      // iOS permission + register for remote messages
      if (Platform.OS === 'ios') {
        const messaging = getMessaging();
        const status = await messaging.requestPermission();
        const ok =
          status === messaging.AuthorizationStatus.AUTHORIZED ||
          status === messaging.AuthorizationStatus.PROVISIONAL;
        if (!ok) return;
        await messaging.registerDeviceForRemoteMessages();
      }

      // Android channel for Notifee (idempotent)
      if (Platform.OS === 'android') {
        console.log("Creating Android notification channel...");
        await notifee.createChannel({
          id: 'book_smart',
          name: 'Book Smart Notifications',
          importance: 4, // IMPORTANCE_HIGH
        });
      }

      try {
        console.log("Requesting FCM token...");
        const token = await getMessaging().getToken();
        if (!token) {
          console.log("No token retrieved");
          throw new Error('No token from FCM');
        }
        console.log('FCM token:', token);
      } catch (e) {
        console.error("FCM token request failed:", e?.message || String(e));
        // Log additional details for debugging
        console.log('Error details:', e);
      }
      

      // Handle foreground notifications
      unsubscribe = getMessaging().onMessage(async (remoteMessage) => {
        const { title, body } = remoteMessage?.notification || {};
        console.log('Notification received:', title, body);
        await notifee.displayNotification({
          title: title || 'Notification',
          body: body || '',
          android: { channelId: 'book_smart' },
          ios: { sound: 'default' },
        });
      });

      // Handle notification opened from background
      getMessaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Opened from background:', remoteMessage?.messageId);
      });
    };

    initFCM().catch((err) =>
      console.log('FCM Initialization Error', err?.message || String(err))
    );

    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <NavigationContainer style={styles.sectionContainer}>
      <Layout />
      {/* <BackgroundTask /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: '#ffffffa8',
  },
});
