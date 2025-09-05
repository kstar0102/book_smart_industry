// index.js
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true; // optional

import '@react-native-firebase/app';
import { AppRegistry } from 'react-native';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Headless background handler (NO Alert / navigation here)
getMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { title, body } = remoteMessage?.notification || {};

  // idempotent: safe to call every time
  await notifee.createChannel({
    id: 'book_smart',
    name: 'Book Smart Notifications',
    importance: 4, // IMPORTANCE_HIGH
  });

  await notifee.displayNotification({
    title: title || 'Notification',
    body: body || '',
    android: { channelId: 'book_smart', pressAction: { id: 'default' } },
    ios: { sound: 'default' },
  });
});

AppRegistry.registerComponent(appName, () => App);
