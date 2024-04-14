import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {useRouter} from '../store/router.store';
import userApi from '../api/user.api';
import {User} from '../models/db.model';
import {useUserStore} from '../store/user.store';
import messaging from '@react-native-firebase/messaging';
import useFCMNotifications from '../components/PassDataNotification';
import {IconButton} from 'react-native-paper';
import Icon from '../components/Icon';
function SplashLayout() {
  const {navigate} = useRouter();
  const userStore = useUserStore();
  const [userProfile, setUserProfile] = useState<User>();

  const checkInitialNotification = async () => {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log(
        'noti caused app to open from quit state',
        initialNotification,
      );
      navigate('/verify-face');
      return true;
    }
  };
  //   checkInitialNotification()

  async function fetchUser() {
    const check = await checkInitialNotification();
    if (check) return;
  
    const userProfileData = await userApi.getProfile();
    console.log(userProfileData)
    setUserProfile(userProfileData);
    userStore.actions.setProfile(userProfileData);
    if (!userProfileData) {
      console.log('no user data');
      return navigate('/login');
    }
  
    if (userProfileData.role === 1 &&
      (!userProfileData?.hasFaceInput || !userProfileData?.hasSpeechInput)
    ) {
      return navigate('/onboarding');
    }
  
    if (userProfileData.role === 10) {
      return navigate('/dashboard');
    }
  
    if (userProfileData.role === 3) {
      return navigate('/parent');
    }
  
    navigate('/home');
  }

  useEffect(() => {
    fetchUser();
  }, [userProfile]);

  return (
    <View style={{flex: 1, alignItems: 'center',justifyContent:'center'}}>
      <IconButton
        icon={() => <Icon name="progress" />}
        size={10}
        onPress={() => {}}
      />
    </View>
  );
}
export default SplashLayout;
