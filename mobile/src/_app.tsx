import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLayout from './layouts/HomeLayout';
import LoginLayout from './layouts/LoginLayout';
import { RootStackParamList } from './core/models/route.model';



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
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

  return (
    <View style={styles.app}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginLayout} />
          <Stack.Screen name="Home" component={HomeLayout} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default App;
