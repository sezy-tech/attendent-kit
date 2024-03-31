import React from 'react';
import {
    SafeAreaView, StyleSheet,
} from 'react-native';

import Login from '../features/Auth/Login';

function LoginLayout(): JSX.Element {
    return (
        <SafeAreaView style={styles.layout}>
            <Login />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    layout: {
        padding: 24,
        flex: 1,
        justifyContent: 'center',
    },
});


export default LoginLayout;
