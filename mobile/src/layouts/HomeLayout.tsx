
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import FaceDetector from '../features/FaceDetector/FaceDetector';
// import { FaceDetector } from '../features/FaceDetector';

function HomeLayout(): JSX.Element {
    console.log('=============HomeLayout=============')
    return (
        <View
            style={{ flex: 1 }}
        >
            <Text>aaaa</Text>
            <FaceDetector />
        </View>
    );
}

export default HomeLayout;
