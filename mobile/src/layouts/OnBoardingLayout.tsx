import { Image, StyleSheet, View } from 'react-native';
import { useUserStore } from '../store/user.store';
import { useRouter } from '../store/router.store';
import { Text } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import { Button } from 'react-native';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Caption,
  SegmentedButtons,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import Icon from '../components/Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import authApi from '../api/auth.api';

export default function Onboarding() {
  const userData = useUserStore();
  const { navigate } = useRouter();
  const [value, setValue] = useState('');
  if (
    userData.data.state.user.hasFaceInput &&
    userData.data.state.user.hasSpeechInput
  ) {
    navigate('');
  }
  const logOut = () => {
    console.log(userData.actions); // Check if clearState exists here
    try {
      authApi.logout();
      console.log('Logged out');
    } catch (err) {
      console.log('Error clearing state:', err);
    }
    navigate('/login');
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#d0f7e9', justifyContent: 'center', paddingBottom: 50 }}>
      <Text
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 25,
          fontWeight: 'bold',
        }}>
        Welcome to AAS
      </Text>
      <View style={{ paddingTop: 30 }}>
        <View style={styles.infoBoxWrapper}>
          <TouchableOpacity onPress={() => navigate('/face-input')}>
            <View
              style={[
                styles.infoBox,
                // {
                //   borderRightColor: '#dddddd',
                //   borderRightWidth: 1,
                // },
              ]}>
              <Icon name="facescan" />
              {/* <Icon name="check" /> */}
              <Caption style={{ fontSize: 18 }}>Scan Face</Caption>
            </View>
          </TouchableOpacity>
          {/* <View style={styles.infoBox}>
            {!userData.data.state.user.hasFaceInput ? (
              <TouchableOpacity onPress={() => navigate('/voice-input')}>
                <Icon name="voice" />
              </TouchableOpacity>
            ) : (
              <Icon name="check" />
            )}
            <Caption>Voice Input</Caption>
          </View> */}
        </View>
      </View>

      {/* <View style={styles.infoBox}>
        <TouchableOpacity onPress={() => navigate('/face-input')}>
          <Icon name="voice" />
        </TouchableOpacity>

        <Icon name="check" />

        <Caption>Faces Input</Caption>
      </View>

      <View style={styles.infoBox}>
        <TouchableOpacity onPress={() => navigate('/verify-face')}>
          <Icon name="voice" />
        </TouchableOpacity>

        <Caption>verify Faces </Caption>
      </View>

      <TouchableRipple onPress={logOut}>
        <View style={styles.menuItem}>
          <Icon name="times" />
          <Text style={styles.menuItemText}>Log Out</Text>
        </View>
      </TouchableRipple> */}
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
  },
  infoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'pink',
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: 'row',
    height: 100,
    marginHorizontal: 50,
    gap: 10,
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
