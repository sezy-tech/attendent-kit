import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Appbar, Avatar, Card, IconButton} from 'react-native-paper';
import {useRouter} from '../../store/router.store';
import {useUserStore} from '../../store/user.store';
import BackgroundImage from '../../components/BackgroundImage';
import Icon from '../../components/Icon';
import Header from '../../components/Header';
// import { useAppStore } from '../store/app.store';
// import { FaceDetector } from '../features/FaceDetector';

function LecturerHome(): JSX.Element {
  console.log('=============HomeLayout=============');

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const {navigate} = useRouter();
  const useStore = useUserStore();
  const router = useRouter();
  const routerHisory = router.getHistory();
  useEffect(() => {}, []);
  return (
    <View style={{flex: 1}}>
      <BackgroundImage source={require('../../../assets/images/bg3.jpeg')} />
      <View style={{ flexDirection:'row'}}>
      <Header hasBack />  
      <View style={{right:0,position:'absolute',padding:5}}>
      <Avatar.Image
          size={48}
          source={require('../../../assets/images/avt.png')}
        />
      </View>
      </View>
       
      <TouchableOpacity
        style={{paddingTop: 50}}
        onPress={() => navigate('/schedule-lecturer')}>
        <View style={{padding: 20, gap: 5, width: 300}}>
          <Card>
            <Card.Title
              title="Schedule in Week"
              subtitle={``}
              left={props => (
                <View style={{marginLeft: 10}}>
                  <Icon name={'tap'} />
                </View>
              )}
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

export default LecturerHome;
