globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import '@react-native-firebase/app';
import { AppRegistry } from 'react-native';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

getMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { title, body } = remoteMessage?.notification || {};

  await notifee.createChannel({
    id: 'book_smart',
    name: 'Book Smart Notifications',
    importance: 4,
  });

  await notifee.displayNotification({
    title: title || 'Notification',
    body: body || '',
    android: { channelId: 'book_smart', pressAction: { id: 'default' } },
    ios: { sound: 'default' },
  });
});

AppRegistry.registerComponent(appName, () => App);