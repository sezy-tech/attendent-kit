
import React, { useEffect } from 'react';
import {
    Text,
} from 'react-native';
import { useRouter } from '../store/router.store';
import userApi from '../api/user.api';
import { User } from 'firebase/auth';
import { useUserStore } from '../store/user.store';


function SplashLayout() {
const {navigate} = useRouter()
const userStore = useUserStore();

 async function FetchUser(){
    const userProfileData = await userApi.getProfile()
    if(!userProfileData){
        navigate('/login')
    }
    if(!userProfileData?.hasFaceInput){
        navigate('/onboarding') 
    }
    if(!userProfileData?.hasSpeechInput){
        navigate('/onboarding') 
    }
    else{
    userStore.actions.setProfile(userProfileData)
    console.log( userStore.data.state.verify.faceVerify)
    navigate('/onboarding') 
    }
}
    useEffect(() => {
        FetchUser()
        // router.dispatch.navigate(firebase.auth().currentUser ? '/home' : '/login')
        // const user = firebase.auth().currentUser;

        // if (user) {
        //     const userId = user.uid;
        //     const reference = database().ref(`/users/${userId}`);

        //     reference.on('value', (snapshot) => {
        //         if (snapshot.exists()) {
        //             console.log('User data:', snapshot.val());
        //         } else {
        //             console.log('User data does not exist.');
        //         }
        //     });

        //     // Clean up the subscription when the component unmounts
        //     return () => {
        //         reference.off(); // Unsubscribe from changes
        //     };
        // } else {
        //     console.log('User is not authenticated.');
        // }
        // navigate('/onboarding')
    }, [])

    return (
        <Text>
            Loading...
        </Text>
    );
}

export default SplashLayout;
