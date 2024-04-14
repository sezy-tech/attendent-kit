import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import Icon from '../components/Icon';
import { useUserStore } from '../store/user.store';
import { useRouter } from '../store/router.store';
import Header from '../components/Header';




export default function Profile(){
    const {navigate} = useRouter()
  
    const userStore = useUserStore()
    const userData = userStore.data.state.user
    const logOut = () => {
      console.log(userStore.actions); // Check if clearState exists here
      try {
        userStore.actions.clearState();
        console.log('State cleared successfully');
      } catch (err) {
        console.log('Error clearing state:', err);
      }
      navigate('/login');
    };
  
    return (
        <SafeAreaView style={styles.container}>
            <Header hasBack />
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image 
                source={{
                  uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
                }}
                size={80}
              />
              <View style={{marginLeft: 20}}>
                <Title style={[styles.title, {
                  marginTop:15,
                  marginBottom: 5,
                }]}>John Doe</Title>
                <Caption style={styles.caption}>@_v2kid</Caption>
              </View>
            </View>
          </View>
    
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
            <Icon name="times" />
              <Text style={{color:"#777777", marginLeft: 20}}>HCM, Viet Nam</Text>
            </View>
            <View style={styles.row}>
            <Icon name="times" />
              <Text style={{color:"#777777", marginLeft: 20}}>+84-{userData.phone}</Text>
            </View>
            <View style={styles.row}>
            <Icon name="times" />
              <Text style={{color:"#777777", marginLeft: 20}}>{userData.email}</Text>
            </View>
          </View>
    
          <View style={styles.infoBoxWrapper}>
              <View style={[styles.infoBox, {
                borderRightColor: '#dddddd',
                borderRightWidth: 1
              }]}>
                <Title>₹140.50</Title>
                <Caption>Wallet</Caption>
              </View>
              <View style={styles.infoBox}>
                <Title>12</Title>
                <Caption>Orders</Caption>
              </View>
          </View>
          <View style={styles.infoBoxWrapper}>
              <View style={[styles.infoBox, {
                borderRightColor: '#dddddd',
                borderRightWidth: 1
              }]}>
                <Title>₹140.50</Title>
                <Caption>Wallet</Caption>
              </View>
              <View style={styles.infoBox}>
                <Title>12</Title>
                <Caption>Orders</Caption>
              </View>
          </View>
    
          <View style={styles.menuWrapper}>
            
            <TouchableRipple onPress={logOut}>
              <View style={styles.menuItem}>
              <Icon name="times" />
                <Text style={styles.menuItemText}>Log Out</Text>
              </View>
            </TouchableRipple>
          </View>
        </SafeAreaView>
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