
import React, { useEffect } from 'react';
import {
    Text,
} from 'react-native';


function SplashLayout() {

    useEffect(() => {
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
    }, [])

    return (
        <Text>
            Loading...
        </Text>
    );
}

export default SplashLayout;
