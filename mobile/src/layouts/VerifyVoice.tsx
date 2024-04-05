import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, PermissionsAndroid, Platform, Pressable, Text, View } from "react-native";
import theme from "../styles/theme.style";
import Icon from "../components/Icon";
import { useUserStore } from "../store/user.store";
import VoiceRecord, { VoiceRecordRef } from "../components/VoiceRecord";
import { modelStore } from "../store/model.store";
import VoiceRecord2 from "../components/VoiceRecord2";
export default function VerifyVoice(){
    const userStore = useUserStore()
    const getClipCloudPath = () => {
        const userid = userStore.data.state.user._id
        console.log(userid)
        return `compare/${userid}/${new Date().getTime()}.mp3`;
      };
    const Recording1Stage = () => {
        const ref = useRef<VoiceRecordRef>(null);
     
        useEffect(() => {
          ref.current?.start();
        }, []);
      
        const onStop = () => {
          modelStore.actions.setRecordingStage('fail');
        };
        const onGetLocalPath = (step: number) => (localPath: string) => {
            const source = modelStore.state.recordingData.sources[step];
            modelStore.actions.setRecordingSource();
          };
        return (
          <View style={{alignContent : 'center', alignItems : 'center'}}>
      <VoiceRecord2
            key={0}
            ref={ref}
            maxDuration={1}
            recordName='read'
            cloudPath={getClipCloudPath}
            onStop={onStop}
            onGetLocalPath={onGetLocalPath(0)}
            // onUploadingPropgress={onUploadingPropgress(0)}
            // onStart={()=>StartRecordButton}
          />
      
          </View>
        );
      };
    
      
    return(
        <View style={{alignContent: 'center', alignItems: 'center'}}>
            <Text>here we verify voice</Text>
            <Recording1Stage />
            <StartRecodButton onPress= {()=>{}}/>
        </View>
    )
   
    function StartRecodButton({ onPress }: any){
        const animationValue1 = useRef(new Animated.Value(75)).current;
        useEffect(() => {
          // animationValue1.setValue(0);
          const animation1 = Animated.timing(animationValue1, {
            toValue: 90,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
          });
      
          const animation2 = Animated.timing(animationValue1, {
            toValue: 75,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
          });
      
          Animated.sequence([animation1, animation2]);
      
          const animationLoop = Animated.loop(
            Animated.sequence([animation1, animation2]),
          );
          animationLoop.start();
      
          return () => {
            animationLoop.stop();
          };
        }, []);
      
        return (
          <Pressable
            style={{
              // backgroundColor: theme.pink[300],
              // backgroundColor: '#ddd',
              width: 110,
              height: 110,
              borderRadius: 80,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 32,
              position: 'relative',
            }}
            onPress={()=>{}}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                // backgroundColor: 'blue',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animated.View
                style={{
                  // width: 50,
                  // height: 50,
                  width: animationValue1,
                  height: animationValue1,
                  borderRadius: 100,
                  backgroundColor: `${theme.pink[300]}88`,
                  // backgroundColor: 'red',
                }}
              ></Animated.View>
            </View>
      
            <View
              style={{
                backgroundColor: theme.pink[300],
                // backgroundColor: '#ff3d3daa',
                width: 70,
                height: 70,
                borderRadius: 80,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Icon name='record' width={25} height={25} />
            </View>
          </Pressable>
        );
      }
}