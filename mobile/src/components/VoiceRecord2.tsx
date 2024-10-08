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
import theme from '../styles/theme.style';
import Button from './Button';
import FBStorage from '@react-native-firebase/storage';
import recognitionApi from '../api/recognition.api';
import {useRouter} from '../store/router.store';
import Icon from './Icon';
import {useUserStore} from '../store/user.store';

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
const VoiceRecord2 = forwardRef<VoiceRecordRef, VoiceRecordProps>(
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
      () => (maxDuration ?? 0) * 10000,
      [maxDuration],
    );
    audioRecorderPlayer.setSubscriptionDuration(0.1);
    console.log('========================= 11111');
    const {navigate} = useRouter();
    const uriRef = useRef('');
    const [recordStatus, setRecordStatus] = useState<
      'INITIAL' | 'RECORDING' | 'PAUSED' | 'STOPPED'
    >('INITIAL');
    const userData = useUserStore();
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
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
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
      console.log(uriRef.current);
      const storageRef = FBStorage().ref().child(cloudPath());
      const task = storageRef.putFile(uriRef.current);
      task.on(
        'state_changed',
        snapshot => {},
        error => {
          // Handle any errors that occurred during the upload
          console.error('Error uploading audio:', error);
          onUploadingError?.();
        },
        () => {
          // Upload completed successfully, now you can get the download URL
          task.snapshot?.ref.getDownloadURL().then(async downloadURL => {
            const verifyResult = await recognitionApi.verifySpeech(downloadURL);
            console.log('File available at', downloadURL);
            if (verifyResult) {
              userData.data.state.verify.speechVerify = true;
              navigate('/verify-face');
            }
          });
        },
      );
    };
    return (
      <View>
        <Text style={{flex: 1, fontSize: 20, paddingTop: 50}}>
          answear this question in 10s
        </Text>
        <Text style={{fontSize: 16}}>what is your name ?</Text>
        <View
          style={{
            paddingTop: 400,
          }}>
          <View style={{left: 0}}>
            <RecordingTimer
              audioRecorderPlayer={audioRecorderPlayer}
              maxDurationMiliseconds={maxDurationMiliseconds}
            />
          </View>
        </View>
      </View>
    );
  },
);

interface RecordingTimerProps {
  audioRecorderPlayer: AudioRecorderPlayer;
  maxDurationMiliseconds: number;
}

const RecordingTimer = forwardRef(
  ({audioRecorderPlayer, maxDurationMiliseconds}: RecordingTimerProps, ref) => {
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
          }}>
          <View
            style={{
              backgroundColor: theme.gray[500],
              height: 4,
              width: progressWidth,
              position: 'absolute',
              left: 0,
              top: 0,
            }}>
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
              }}>
              {timerText}
            </Text>
          </View>
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({});

export default VoiceRecord2;
