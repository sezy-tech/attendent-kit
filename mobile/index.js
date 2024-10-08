/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/_app';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAQABpSao1uYT9oZjeH-vkHIHgFCUktioQ",
//   authDomain: "khang-a.firebaseapp.com",
//   databaseURL: "https://khang-a-default-rtdb.firebaseio.com",
//   projectId: "khang-a",
//   storageBucket: "khang-a.appspot.com",
//   messagingSenderId: "1046435121095",
//   appId: "1:1046435121095:web:e2d1a5b68a9d02081b3be2",
//   measurementId: "G-4M9MEV6T4R"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
