
import React, { useEffect, useState } from 'react';
import {
    Button,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import FaceDetector from '../features/FaceDetector/FaceDetector';
import { useRouter } from '../store/router.store';
import axios from 'axios';
import recognitionApi from '../api/recognition.api';
import { useUserStore } from '../store/user.store';
import userApi from '../api/user.api';
// import { useAppStore } from '../store/app.store';
// import { FaceDetector } from '../features/FaceDetector';

function HomeLayout(): JSX.Element {
    const { navigate } = useRouter()
    console.log('=============HomeLayout=============')
    // const appStore = useAppStore();
    const userStore = useUserStore();
    useEffect(()=>{
    },[])
    return (
        <View
            style={{ flex: 1 }}
        >
            <Text>aaaa</Text>
            {/* <Button title={'Face Input'} onPress={Input} /> */}
      <Button title={'Face Input'} onPress={()=>navigate('/face-input')} />
      <Button title={'voice Input'} onPress={()=>navigate('/voice-input')} />
      {/* <Button title={'verify'} onPress={()=>navigate('/verify')} /> */}
            {/* <FaceDetector /> */}
        </View>
    );
}

export default HomeLayout;
