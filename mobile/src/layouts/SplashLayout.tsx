import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, Text, View } from 'react-native';
import { useRouter } from '../store/router.store';
import userApi from '../api/user.api';
import { User } from '../models/db.model';
import { useUserStore } from '../store/user.store';
import messaging from '@react-native-firebase/messaging';
import AppContext from '../context/AppContext';
import LoadingIcon from '../components/LoadingIcon';
function SplashLayout() {
  const { navigate } = useRouter();
  const userStore = useUserStore();
  const [userProfile, setUserProfile] = useState<User>();
  const [check, setCheck] = useState(false);
  const checkRef = useRef(false);

  const appContext = useContext(AppContext);


  async function fetchUser() {
    // const check = await checkInitialNotification();
    // if (check) return;

    // const fcmToken = await messaging().getToken();
    // if (fcmToken) {
    //   userApi.setFCMToken(userStore.data.state.user._id, fcmToken)
    // }

    console.log('------------');
    console.log('------------');
    console.log('------------');
    const userProfileData = await userApi.getProfile();
    console.log(userProfileData);
    setUserProfile(userProfileData);
    userStore.actions.setProfile(userProfileData);
    if (!userProfileData) {
      console.log('no user data');
      return navigate('/login');
    }

    if (userProfileData.role === 1 &&
      (!userProfileData?.hasFaceInput)
    ) {
      return navigate('/onboarding');
    }

    if (userProfileData.role === 10) {
      return navigate('/dashboard');
    }

    if (userProfileData.role === 3) {
      return navigate('/parent');
    }

    const remoteMessage = await messaging()
      .getInitialNotification()

    if (remoteMessage) {
      setCheck(true);
      checkRef.current = true;
      const { path, courseId } = remoteMessage.data ?? {};
      userStore.actions.setCourseId(courseId as string)
      appContext?.setCourseId(courseId as string)
      setTimeout(() => {
        navigate(`${path}`);
      })
      return
    }
    setTimeout(() => {
      !checkRef.current && navigate('/home');
    })
  }

  useEffect(() => {
    fetchUser();
  }, [userProfile]);


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../../assets/images/logo.jpeg')} style={{ borderRadius: 38, width: 180, height: 180, marginBottom:38 }} />
      <LoadingIcon />
    </View>
  );
}
export default SplashLayout;
