import {Image, StyleSheet, View} from 'react-native';
import {useUserStore} from '../store/user.store';
import {useRouter} from '../store/router.store';
import {Text} from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import {Button} from 'react-native';
import {useEffect, useState} from 'react';
import {
  Avatar,
  Caption,
  SegmentedButtons,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import Icon from '../components/Icon';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function Onboarding() {
  const userData = useUserStore();
  const {navigate} = useRouter();
  const [value, setValue] = useState('');
  if(userData.data.state.user.hasFaceInput && userData.data.state.user.hasSpeechInput){
    navigate('')
  }
  return (
    <View style={{flex: 1,backgroundColor:'#d0f7e9'}}>
      <Text
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 20,
        }}>
        Onboarding
      </Text>
      <View style={{paddingTop:30}}>
      <View style={styles.infoBoxWrapper}>
        <View
          style={[
            styles.infoBox,
            {
              borderRightColor: '#dddddd',
              borderRightWidth: 1,
            },
          ]}>
          {!userData.data.state.user.hasFaceInput ? (
            <TouchableOpacity onPress={() => navigate('/face-input')}>
              <Icon name="facescan" />
            </TouchableOpacity>
          ) : (
            <Icon name="check" />
          )}
          <Caption>Face Input</Caption>
        </View>
        <View style={styles.infoBox}>
        {!userData.data.state.user.hasFaceInput ? (
            <TouchableOpacity onPress={() => navigate('/voice-input')}>
              <Icon name="voice" />
            </TouchableOpacity>
          ) : (
            <Icon name="check" />
          )}
          <Caption>Voice Input</Caption>
        </View>
      </View>
      </View>
   


     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});
