import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from '../store/router.store';
import { useUserStore, userStore } from '../store/user.store';
import BackgroundImage from '../components/BackgroundImage';
import AppHeader from '../features/AppHeader';
import Attendances from '../features/Attendances';
import messaging from '@react-native-firebase/messaging';
import userApi from '../api/user.api';

// import { useAppStore } from '../store/app.store';
// import { FaceDetector } from '../features/FaceDetector';

function HomeLayout(): JSX.Element {

  console.log('=============HomeLayout=============');

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const { navigate } = useRouter();
  const userStore = useUserStore();

  const setFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      userApi.setFCMToken(userStore.data.state.user._id, fcmToken)
    }

  }
  // userAttendanceApi
  useEffect(() => {
    setFCMToken();
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      <BackgroundImage source={require('../../assets/images/bg1.jpeg')} />
      <AppHeader />
      <Attendances/>
    </View>
  );
}

export default HomeLayout;
