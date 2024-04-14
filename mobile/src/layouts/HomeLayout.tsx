import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useRouter} from '../store/router.store';

import {Appbar, Avatar, Card, IconButton} from 'react-native-paper';
import Icon from '../components/Icon';
import {useUserStore, userStore} from '../store/user.store';
import BackgroundImage from '../components/BackgroundImage';

// import { useAppStore } from '../store/app.store';
// import { FaceDetector } from '../features/FaceDetector';

function HomeLayout(): JSX.Element {
  console.log('=============HomeLayout=============');

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const {navigate} = useRouter();
  const useStore = useUserStore();

  useEffect(() => {}, []);
  return (
    <View style={{flex: 1}}>
      <BackgroundImage source={require('../../assets/images/bg3.jpeg')} />
      <Appbar.Header style={{backgroundColor: '#eddcf7'}}>
        <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>navigate('/profile')}>
          <Avatar.Image
            size={48}
            source={require('../../assets/images/avt.png')}
          />
          <Text style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}> hi {userStore.state.user.email}</Text>
        </TouchableOpacity>
      </Appbar.Header>
      <TouchableOpacity
        style={{paddingTop: 50}}
        onPress={() => navigate('/schedule')}>
        <View style={{padding: 20, gap: 5, width: 300}}>
          <Card>
            <Card.Title
              title="Schedule in Week"
              subtitle={``}
              left={props => <Icon name={'tap'} />}
            />
            <Card.Content>
              <Text>Check Attendance</Text>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default HomeLayout;
