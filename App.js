// App.js
import React, { useEffect } from 'react';
import { StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import { getMessaging } from '@react-native-firebase/messaging';

import Layout from './src/layout/Layout';
import BackgroundTask from './src/utils/backgroundTask';

export default function App() {
  useEffect(() => {
    let unsubscribe = () => {};

    const initFCM = async () => {
      // Android 13+ (API 33) notifications permission
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
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
        await notifee.createChannel({
          id: 'book_smart',
          name: 'Book Smart Notifications',
          importance: 4, // IMPORTANCE_HIGH
        });
      }

      // FCM token (may be null on devices without Play services)
      try {
        const token = await getMessaging().getToken();
        if (!token) throw new Error('No token from FCM');
        console.log('FCM token:', token);
      } catch (e) {
        console.log(
          'FCM unavailable on this device/emulator:',
          e?.message || String(e)
        );
      }

      // Foreground notifications
      unsubscribe = getMessaging().onMessage(async (remoteMessage) => {
        const { title, body } = remoteMessage?.notification || {};
        await notifee.displayNotification({
          title: title || 'Notification',
          body: body || '',
          android: { channelId: 'book_smart' },
          ios: { sound: 'default' },
        });
      });

      // When the app is opened from background by tapping a notification
      getMessaging().onNotificationOpenedApp((remoteMessage) => {
        // You can navigate based on remoteMessage.data here
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
      <BackgroundTask />
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
