import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import theme from '../../styles/theme.style';
import Icon from '../../components/Icon';
// import DB from '../../db';
import { modelStore, useModelStore } from '../../store/model.store';
import VoiceRecord, { VoiceRecordRef } from '../../components/VoiceRecord';
import Text from '../../components/Text';
import BackgroundImage from '../../components/BackgroundImage';
import { useUserStore, userStore } from '../../store/user.store';

function CreateUserModelRecord() {
  const userStore = useUserStore();
  const modelStore = useModelStore();
  const scriptContentPause = useRef(false);

  return (
    <View style={[styles.container]}>
      {/* <BackgroundImage source={require('../../../assets/images/bg10.jpeg')} /> */}
      <View>
        <BackgroundImage source={require('../../../assets/images/bg3.jpeg')} />
        <View style={styles.recorderWrapper}>
       <Recording1Stage />
        {/* {(stepTut == 1 || step == 0) && <VoiceRecord key={0} ref={recorder1Ref} maxDuration={5} recordName="read" cloudPath={getClipCloudPath} onStop={onStep1RecordStop} onGetLocalPath={onGetLocalPath(0)} />}
                {(stepTut == 2 || step == 1) && <VoiceRecord key={1} ref={recorder2Ref} maxDuration={8} recordName="sing" cloudPath={getClipCloudPath} onStop={onStep2RecordStop} onGetLocalPath={onGetLocalPath(1)} />} */}
      </View>
      </View>
      
      

      {/* <Button label='play' onPress={() => setStep(s => s + 1)} /> */}
    </View>
  );
}

const onGetLocalPath = (step: number) => (localPath: string) => {
  const source = modelStore.state.recordingData.sources[step];
  modelStore.actions.setRecordingSource();
};
// const onUploadingPropgress = (step: number) => (progess: number) => {
//   const source = modelStore.state.recordingData.sources[step];
//   source.progess = progess;
//   modelStore.dispatch((s: { recordingData: { sources: any[]; }; }) => {
//     s.recordingData.sources = [...s.recordingData.sources];
//   });
// };

const getClipCloudPath = () => {
  const userid = userStore.state.user._id;
  if (!userid) {
    //Sentry
  }
  console.log(userid)
  return `onboarding/${userid}/${new Date().getTime()}.mp3`;
};

const Recording1Stage = () => {
  const ref = useRef<VoiceRecordRef>(null);
const onPress=()=>{

}
  useEffect(() => {
    ref.current?.start();
  }, []);

  const onStop = () => {
    modelStore.actions.setRecordingStage('fail');
  };
  return (
    <View style={{alignContent : 'center', alignItems : 'center'}}>
<VoiceRecord
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




interface StartRecordButtonProps {
  onPress: () => void;
}


function StartRecordButton() {
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

interface OnboardingScriptProps {
  scripts: string[][];
  paused: React.MutableRefObject<boolean>;
}

function OnboardingScript({ scripts, paused }: OnboardingScriptProps) {
  const scrollViewRef = useRef<any>(null);
  const scriptContentScrollOffset = useRef(0);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollViewRef.current && !paused.current) {
        scriptContentScrollOffset.current += 0.5;
        scrollViewRef.current.scrollTo({
          x: 0,
          y: scriptContentScrollOffset.current,
          animated: false,
        });
      }
    };

    // const interval = setTimeout(scrollToBottom, 500); // Delay scrolling for 1 second
    const interval = setInterval(
      () => requestAnimationFrame(scrollToBottom),
      100,
    ); // Delay scrolling for 1 second

    return () => {
      clearInterval(interval);
      // clearTimeout(interval)
    };
  }, []);

  return (
    <View style={styles.scriptWrapper}>
      {/* <BackgroundImage source={require('../../../assets/images/bg5.jpeg')} /> */}
      <ScrollView
        onScrollBeginDrag={() => (paused.current = true)}
        onScrollEndDrag={() => (paused.current = false)}
        ref={scrollViewRef}
        onScroll={e => {
          scriptContentScrollOffset.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16} // Adjust this value for smoother or slower animations
      >
        {scripts?.map((script, scriptIndex) => (
          <View key={scriptIndex} style={styles.scriptItem}>
            {script.map((content, contentIndex) => (
              <Text
                key={contentIndex}
                style={
                  contentIndex
                    ? styles.scriptContent
                    : styles.scriptContentTitle
                }
              >
                {content}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recorderWrapper: {},
  scriptWrapper: {
    margin: 16,
  },
  scriptItem: {
    margin: 4,
    padding: 16,
  },
  scriptContentTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },
  scriptContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepWrapper: {
    backgroundColor: `${theme.primary.backgroundColor}cc`,
  },
  stepContainer: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxWidth: '70%',
  },
  stepItem: {},
  stepNumber: {
    backgroundColor: '#ddd',
  },
  stepLabel: {
    color: '#eee',
  },
  stepNumberWrapperActive: {},
});

export default CreateUserModelRecord;
