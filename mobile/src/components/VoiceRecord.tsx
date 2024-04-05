import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import Text from './Text';
import type {
  AudioSet,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
// import fs from 'react-native-fs';
// import Icon from './Icon'
import theme from '../styles/theme.style'
import Button from './Button';
import FBStorage from '@react-native-firebase/storage';
import recognitionApi from '../api/recognition.api';
import { useRouter } from '../store/router.store';
import Icon from './Icon';

export interface VoiceRecordRef {
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  upload: () => void;
}
interface StartRecordButtonProps {
  onPress: () => void;
}
interface VoiceRecordProps {
  cloudPath: () => string;
  maxDuration: number;
  recordName: string;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  // onUploadingPropgress?: (p: number) => void;
  onUploadingError?: () => void;
  onGetLocalPath?: (p: string) => void;
}
const VoiceRecord = forwardRef<VoiceRecordRef, VoiceRecordProps>(
  (
    {
      cloudPath,
      maxDuration,
      recordName,
      onStart,
      onPause,
      onResume,
      onStop,
      // onUploadingPropgress,
      onUploadingError,
      onGetLocalPath,
    },
    ref,
  ) => {
    let audioRecorderPlayer = useMemo(() => new AudioRecorderPlayer(), []);
    const maxDurationMiliseconds = useMemo(
      () => (maxDuration ?? 0) * 1000,
      [maxDuration],
    );
    audioRecorderPlayer.setSubscriptionDuration(0.1);
    console.log('========================= 11111');
    const {navigate} = useRouter()
    const uriRef = useRef('');
    const [recordStatus, setRecordStatus] = useState<
      'INITIAL' | 'RECORDING' | 'PAUSED' | 'STOPPED'
    >('INITIAL');

    useImperativeHandle(
      ref,
      () => ({
        start: onStartRecord,
        pause: onPauseRecord,
        resume: onResumeRecord,
        stop: onStopRecord,
        upload: uploadToCloud,
      }),
      [],
    );

    useEffect(() => {
      console.log(
        '========================= audioRecorderPlayer.removeRecordBackListener();=============================',
      );
      return () => {
        onRemoveRecord();
      };
    }, []);

    const path = Platform.select({
      ios: undefined,
      android: undefined,
      // Discussion: https://github.com/hyochan/react-native-audio-recorder-player/discussions/479
      // android: 'https://firebasestorage.googleapis.com/v0/b/cooni-ebee8.appspot.com/o/test-audio.mp3?alt=media&token=d05a2150-2e52-4a2e-9c8c-d906450be20b',
      // ios: 'https://staging.media.ensembl.fr/original/uploads/26403543-c7d0-4d44-82c2-eb8364c614d0',
      // ios: 'hello.m4a',
      // android: `${this.dirs.CacheDir}/hello.mp3`,
    });

    const onStartRecord = async () => {
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('permissions granted');
          } else {
            console.log('All required permissions not granted');

            return;
          }
        } catch (err) {
          console.warn(err);

          return;
        }
      }
      onStart?.();
      // setRecordStatus('RECORDING');
      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
      };

      await audioRecorderPlayer.stopRecorder();
      console.log(path)
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      console.log('uri'+uri)
      onGetLocalPath?.(uri);
      uriRef.current = uri;

      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        // console.log('record-back', e);
        if (e.currentPosition >= maxDurationMiliseconds) onStopRecord();
      });
      
    };

    const onPauseRecord = async () => {
      setRecordStatus('PAUSED');
      onPause?.();
      try {
        const r = await audioRecorderPlayer.pauseRecorder();
        console.log(r);
      } catch (err) {
        console.log('pauseRecord', err);
      }
    };

    const onResumeRecord = async () => {
      // const aa = await audioRecorderPlayer.resumeRecorder();
      const aa = await audioRecorderPlayer.resumeRecorder();
      // console.log('========')
      // console.log(aa)
      setRecordStatus('RECORDING');
      onResume?.();
    };

    const onRemoveRecord = async () => {
      setRecordStatus('INITIAL');
      const result = await audioRecorderPlayer.stopRecorder();
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removeRecordBackListener();
    };

    const onStopRecord = async () => {
      onRemoveRecord();
      onStop?.();
      uploadToCloud();
    };
    const uploadToCloud = () => {
      // Create a reference to the destination in Firebase Storage
      console.log(uriRef.current)
      const storageRef = FBStorage().ref().child(cloudPath());
      const task = storageRef.putFile(uriRef.current);
      task.on(
        'state_changed',
        snapshot => {
          // Handle progress here (if needed)
          console.log('Upload is ');
        },
        error => {
          // Handle any errors that occurred during the upload
          console.error('Error uploading audio:', error);
          onUploadingError?.();
        },
        () => {
          // Upload completed successfully, now you can get the download URL
          task.snapshot?.ref.getDownloadURL().then(async downloadURL => {
            console.log('File available at', downloadURL);
            await recognitionApi.addSpeech(downloadURL)
          });
          navigate('')
        },
      );
      
    };
    return (
      <View>
          <Text style={{fontSize : 20}}>answear this question in 15s</Text>
          <Text>what is your name</Text>
        <Text style={{ paddingTop:500,position:'relative'}}></Text>
 <StartRecodButton onPress={onStartRecord} />
 <View style={{height: 500,paddingLeft: 90}}>
       <RecordingTimer
          audioRecorderPlayer={audioRecorderPlayer}
          maxDurationMiliseconds={maxDurationMiliseconds}
        />
      </View>
     
      </View>
 
    );
  },
);
function StartRecodButton({ onPress }: StartRecordButtonProps){
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
      onPress={onPress}
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

interface RecordingTimerProps {
  audioRecorderPlayer: AudioRecorderPlayer;
  maxDurationMiliseconds: number;
}

const RecordingTimer = forwardRef(
  (
    { audioRecorderPlayer, maxDurationMiliseconds }: RecordingTimerProps,
    ref,
  ) => {
    const timerTextWidthRef = useRef<any>(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        console.log(e.currentPosition);
        setTimer(e.currentPosition);
      });
    }, []);

    const timerText = audioRecorderPlayer.mmssss(timer).slice(0, -3);
    const screenWidth = Dimensions.get('screen').width;

    const progressWidth =
      !maxDurationMiliseconds || !timer
        ? 0
        : (timer / maxDurationMiliseconds) * screenWidth;
    return (
      <>
        <View
          style={{
            backgroundColor: theme.gray[300],
            height: 4,
            width: '100%',
            position: 'relative',
          }}
        >
          <View
            style={{
              backgroundColor: theme.gray[500],
              height: 4,
              width: progressWidth,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          ></View>
        </View>
   
        <Text
          onLayout={e =>
            (timerTextWidthRef.current = e.nativeEvent.layout.width)
          }
          style={{
            position: 'absolute',
            left:
              progressWidth + timerTextWidthRef.current >= screenWidth
                ? screenWidth - timerTextWidthRef.current
                : progressWidth,
            paddingRight: 8,
          }}
        >
          {timerText}
        </Text>
      </>
    );
  },
);

const styles = StyleSheet.create({});

export default VoiceRecord;
