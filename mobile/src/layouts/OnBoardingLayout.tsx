import {Image, View} from 'react-native';
import {useUserStore} from '../store/user.store';
import {useRouter} from '../store/router.store';
import {Text} from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import {Button} from 'react-native';
import { useEffect } from 'react';

export default function Onboarding() {
  const userData = useUserStore();
  const {navigate} = useRouter();
  if(userData.data.state.verify.speechVerify&&userData.data.state.verify.faceVerify){
    navigate('/schedule')
  }
  return (
    <View style={{flex: 1}}>
      <BackgroundImage
        source={{
          uri: 'https://i.pinimg.com/564x/54/71/6a/54716a3848c6fbfb5770d4831803532b.jpg',
        }}
      />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <View style={{gap: 10, paddingTop: 20}}>
          <Text
            style={{
              fontSize: 20,
            }}>
            Onboarding
          </Text>
          {!userData.data.state.user.hasFaceInput && (
            <Button
              title="faceid input"
              onPress={() => navigate('/face-input')}
            />
          )}
        {!userData.data.state.user.hasSpeechInput && (
          <Button title="voice input" onPress={() => navigate('')} />
        )}
        {!userData.data.state.verify.faceVerify && (
           <Button
           title="face verify"
           onPress={() => navigate('/verify-face')}
         />
        )}
        {!userData.data.state.verify.speechVerify && (
           <Button
           title="voice verify"
           onPress={() => navigate('/verify-voice')}
         />
        )}
        </View>
      </View>
    </View>
  );
}
