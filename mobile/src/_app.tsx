import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLayout from './layouts/HomeLayout';
import LoginLayout from './layouts/LoginLayout';
import { RootStackParamList } from './core/models/route.model';
import GetFaceMark from './layouts/FaceInput';
import AppRouting from './AppRouting';
import { StoreProvider } from './core/redux-context/store';
import { UserStoreProvider } from './store/user.store';
import { PaperProvider } from 'react-native-paper';


function App(): JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';
  // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  //ios
  //   import messaging from '@react-native-firebase/messaging';

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }




  // useEffect(() => {
  //   const checkCameraPermission = async () => {
  //     try {
  //       const result = await check(
  //         Platform.OS === 'android'
  //           ? PERMISSIONS.ANDROID.CAMERA
  //           : PERMISSIONS.IOS.CAMERA
  //       );

  //       if (result === RESULTS.DENIED) {
  //         const permissionResult = await request(
  //           Platform.OS === 'android'
  //             ? PERMISSIONS.ANDROID.CAMERA
  //             : PERMISSIONS.IOS.CAMERA
  //         );
  //         if (permissionResult === RESULTS.GRANTED) {
  //           // Permission granted
  //         } else {
  //           // Permission denied
  //         }
  //       } else if (result === RESULTS.GRANTED) {
  //         // Permission already granted
  //       } else {
  //         // Permission denied
  //       }
  //     } catch (error) {
  //       console.error('Error checking camera permission:', error);
  //     }
  //   };

  //   checkCameraPermission();
  // }, []);
  useEffect(() => {
    requestNotificationPermission();
    requestCameraPermission();
    
  }, []);
  return (
<StoreProvider providers={[
      UserStoreProvider
    ]}>
    <PaperProvider>

<View style={styles.app}>
     <AppRouting />
   </View>
   </PaperProvider>

    </StoreProvider>

    
    
  );
}



const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

async function requestCameraPermission() {
  try {
    const result = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    );

    if (result === RESULTS.DENIED) {
      const permissionResult = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA,
      );
      if (permissionResult === RESULTS.GRANTED) {
        console.log('camera permissions granted');
        // Permission granted
      } else {
        // Permission denied
      }
    } else if (result === RESULTS.GRANTED) {
      // Permission already granted
    } else {
      // Permission denied
    }
  } catch (error) {
    console.error('Error checking camera permission:', error);
  }
}

async function requestNotificationPermission() {
  try {
    const granted = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
        : PERMISSIONS.IOS.CAMERA,
    );
    // const granted = await PushNotification.requestPermissions(['alert', 'badge', 'sound']);
    if (granted) {
      console.log('Notification permissions granted');
      // You can now schedule and send notifications
    } else {
      console.log('Notification permissions denied');
      // Handle the case where the user denied permissions
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }
  // try {
  //   const result = await check(
  //     Platform.OS === 'android'
  //       ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
  //       : PERMISSIONS.IOS.NOTIFICATIONS
  //   );

  //   if (result === RESULTS.DENIED) {
  //     const permissionResult = await request(
  //       Platform.OS === 'android'
  //         ? PERMISSIONS.ANDROID.CAMERA
  //         : PERMISSIONS.IOS.CAMERA
  //     );
  //     if (permissionResult === RESULTS.GRANTED) {
  //       // Permission granted
  //     } else {
  //       // Permission denied
  //     }
  //   } else if (result === RESULTS.GRANTED) {
  //     // Permission already granted
  //   } else {
  //     // Permission denied
  //   }
  // } catch (error) {
  //   console.error('Error checking camera permission:', error);
  // }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default App;
