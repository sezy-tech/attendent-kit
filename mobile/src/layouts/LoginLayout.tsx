import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Login from '../features/Auth/Login';
import BackgroundImage from '../components/BackgroundImage';

function LoginLayout(): JSX.Element {
  return (
    <SafeAreaView style={styles.layout}>
      <BackgroundImage source={require('../../assets/images/bg1.jpeg')} />
      <Login />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default LoginLayout;
