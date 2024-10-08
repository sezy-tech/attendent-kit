import React, { ReactNode, useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLayout from './layouts/HomeLayout';
import LoginLayout from './layouts/LoginLayout';
import { RootStackParamList } from './core/models/route.model';
import AppRouting from './AppRouting';
import { StoreProvider } from './core/redux-context/store';
import { UserStoreProvider, useUserStore, userStore } from './store/user.store';
import { AppStoreProvider } from './store/app.store';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import userApi from './api/user.api';
import { useRouter } from './store/router.store';

import { RouterStoreConsumer, RouterStoreProvider } from './store/router.store';
import SplashLayout from './layouts/SplashLayout';
import FaceInput from './layouts/FaceInput';
import VerifyFace from './layouts/VerifyFace';
import VoiceInput from './layouts/VoiceInput';

import Onboarding from './layouts/OnBoardingLayout';
import VerifyVoice from './layouts/VerifyVoice';
import Dashboard from './layouts/adminLayout/DashBoard';
import RoomLayout from './layouts/adminLayout/RoomLayout';
import UserLayout from './layouts/adminLayout/UserLayout';
import SubjectLayout from './layouts/adminLayout/SubjectLayout';
import Schedule from './layouts/Schedule';
import ParentHome from './layouts/parentLayout/ParentHome';
import Profile from './layouts/ProfileLayout';
import AppContext from './context/AppContext';

function App(): JSX.Element {
  // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  // ios
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

  const [courseId, setCourseId] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{courseId, setCourseId}}>
      <GestureHandlerRootView>
        <StoreProvider providers={[AppStoreProvider, UserStoreProvider]}>
          <PaperProvider>
            <View style={styles.app}>
              <RouterStoreProvider>
                <BackgroundJob>
                  <RouterStoreConsumer
                    routes={[
                      {
                        path: '/parent',
                        name: 'parend',
                        element: <ParentHome />,
                      },
                      {
                        path: '/login',
                        name: 'login',
                        element: <LoginLayout />,
                      },
                      {
                        path: '/dashboard',
                        name: 'dashboard',
                        element: <Dashboard />,
                      },
                      {
                        path: '/admin-room',
                        name: 'admin-room',
                        element: <RoomLayout />,
                      },
                      {
                        path: '',
                        name: 'splash',
                        element: <SplashLayout />,
                      },
                      {
                        path: '/onboarding',
                        name: 'onboarding',
                        element: <Onboarding />,
                      },

                      {
                        path: '/schedule',
                        name: 'schedule',
                        element: <Schedule />,
                      },
                      {
                        path: '/schedule-lecturer',
                        name: 'schedule',
                        element: <Schedule />,
                      },
                      {
                        path: '/admin-user',
                        name: 'admin-user',
                        element: <UserLayout />,
                      },
                      {
                        path: '/admin-subject',
                        name: 'admin-subject',
                        element: <SubjectLayout />,
                      },
                      {
                        path: '/verify-face',
                        name: 'verify',
                        element: <VerifyFace />,
                      },
                      {
                        path: '/verify-voice',
                        name: 'verify-voice',
                        element: <VerifyVoice />,
                      },
                      {
                        path: '/home',
                        name: 'home',
                        element: <HomeLayout />,
                      },
                      {
                        path: '/face-input',
                        name: 'faceinput',
                        element: <FaceInput />,
                      },
                      {
                        path: '/voice-input',
                        name: 'voice-input',
                        element: <VoiceInput />,
                      },
                      {
                        path: '/profile',
                        name: 'profile',
                        element: <Profile />,
                      },
                    ]}
                  />
                </BackgroundJob>
              </RouterStoreProvider>
            </View>
          </PaperProvider>
        </StoreProvider>
      </GestureHandlerRootView>
      </AppContext.Provider>
  );
}

const BackgroundJob = ({ children }: { children: ReactNode }) => {
  const { navigate } = useRouter();
  const appContext = React.useContext(AppContext);
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await requestNotificationPermission();
        await requestCameraPermission();
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('FCM Message:', remoteMessage);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    requestPermissions();

    // Clean up function
    return () => {
      // Unsubscribe from messaging listener here if needed
    };
  }, []);

  useEffect(() => {
    messaging().onMessage(remoteMessage => {
      const { path, courseId } = remoteMessage.data ?? {};
      userStore.actions.setCourseId(courseId as string)
      appContext?.setCourseId(courseId as string)

      console.log("=================================================")
      console.log("=================================================")
      console.log("=====================111============================")
      console.log("=================================================")
      console.log("=================================================")
      console.log(remoteMessage)
      setTimeout(()=>{
        navigate(`${path}`);
      })

      navigate('/verify-face');
    })
  }, []);
  return children
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
      console.log('Notification permissions granted', granted);
      // const fcmToken = await messaging().getToken();
      // if (fcmToken) {
      //   // userApi.setFCMToken(fcmToken),
      //   console.log('FCM Token:', fcmToken);
      //   await userApi.deviceId(fcmToken);

      //   // Now you have the FCM token, you can save it to your server or use it to send notifications
      //   //call an api to save deviveId
      //   // userStore.actions.setDeviceId(fcmToken);
      // } else {
      //   console.log('FCM Token not available');
      // }
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
