import messaging from '@react-native-firebase/messaging';
const useFCMNotifications = (navigate :any) => {
    messaging().onMessage(async (remoteMessage) => {
      const { notification, data } = remoteMessage;
  
      if (notification) {
        console.log(notification);
      }
  
      if (data) {
        console.log('Received data:', data.url);
        navigate('/verify-voice'); // Assuming navigate is correctly defined and passed
      }
    });
  };
  
  export default useFCMNotifications;