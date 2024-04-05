import { Text, View } from "react-native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useEffect, useState } from "react";
import VoiceRecord from "../components/VoiceRecord";
import CreateUserModelRecord from "../features/UploadRecord/CreateUserVoiceRecord";
export default function VoiceInput(){
    const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
   
  
    useEffect(() => {
      // Cleanup function
      return () => {
        audioRecorderPlayer.removeRecordBackListener();
        audioRecorderPlayer.removePlayBackListener();
      };
    }, [audioRecorderPlayer]);
  
   
    
    return(
        <View style={{flex : 1, alignContent: 'center', justifyContent : 'flex-end', flexDirection : 'column'}}>
            <CreateUserModelRecord />
        </View>
    )
}