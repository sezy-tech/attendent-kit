import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  DrawerLayoutAndroid,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native';
import {useUserStore} from '../../store/user.store';
import Icon from '../../components/Icon';
import {Avatar, Caption, Card, IconButton, Title} from 'react-native-paper';
import {useRouter} from '../../store/router.store';
interface Room {
  _id: string;
  name: string;
}
export default function Dashboard() {
  const userStore = useUserStore();
  const {navigate} = useRouter();

  const drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
    'left',
  );

  const navigationView = () => (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          paddingTop:20
        }}
        onPress={() => navigate('/profile')}>
        <Avatar.Image
          size={48}
          source={require('../../../assets/images/avt.png')}
        />
      </TouchableOpacity>

      <Text style={{alignSelf: 'center', alignItems: 'center'}}>
        I'm in the Drawer!
      </Text>
  
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#e6f5ec'}}>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={150}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, color: '#fa98e6', paddingTop: 30}}>
            Welcome to the Dashboard!
          </Text>
        </View>
        <Pressable onPress={() => drawer.current?.openDrawer()}>
          <Icon name="menu" />
        </Pressable>
    <View style={{paddingTop:20}}>
    <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <TouchableOpacity onPress={() => navigate('/admin-room')}>
              <Icon name="classicon" />
              <Caption>Manage Class</Caption>
            </TouchableOpacity>
          </View>
          <View style={styles.infoBox}>
            <TouchableOpacity onPress={() => navigate('/admin-room')}>
              <Icon name="room" />
              <Caption>Manage Room</Caption>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}>
            <TouchableOpacity onPress={() => navigate('/admin-subject')}>
              <Icon name="book" />
              <Caption>Manage Subject</Caption>
            </TouchableOpacity>
          </View>
          <View style={styles.infoBox}>
            <TouchableOpacity onPress={() => navigate('/admin-user')}>
              <Icon name="relationship" />
              <Caption>Manage User</Caption>
            </TouchableOpacity>
          </View>
        </View>
    </View>
       
      </DrawerLayoutAndroid>
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
