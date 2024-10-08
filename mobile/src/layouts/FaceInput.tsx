import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native';
import FaceDetection, {
  FaceDetectionOptions,
} from '@react-native-ml-kit/face-detection';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useUserStore, userStore } from '../store/user.store';
import { useRouter } from '../store/router.store';
import recognitionApi from '../api/recognition.api';
import ImageResizer from "react-native-image-resizer";
import ImageEditor from "@react-native-community/image-editor";
import { calculateAvgDistance, calculatePointDistance } from '../helpers/face-landmark.helper';
import userApi from '../api/user.api';

type Bounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Face = {
  bounds: Bounds;
};

export default function FaceInput() {
  const { navigate } = useRouter();
  const [isProcessing, setProcessing] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const userStore = useUserStore();
  const pictureCount = useRef(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const device = useCameraDevice('front');
  const [showWarning, setShowWarning] = useState(false);
  const [waitTime, setWaitTime] = useState(new Date().getTime());
  if (device == null) return <Text>No Camera</Text>;

  const limitedDistanceValue = 2
  const distancesList = useRef<number[][]>([])

  const detectFaceAndTakePicture = async () => {
    if (!cameraRef.current || isProcessing) return;
    setProcessing(true);
    try {
      // First, take a short photo to perform face detection
      const previewPhoto = await cameraRef.current.takePhoto({
        enableShutterSound: false,
        qualityPrioritization: 'speed',
      });
      // console.log('Preview Photo:', previewPhoto);
      const previewPhotoPath = previewPhoto.path;

      const previewFileUri = Platform.OS === 'android'
        ? `file://${previewPhotoPath}`
        : previewPhotoPath;

      const faceDetectionResult = await FaceDetection.detect(
        previewFileUri,
        {
          performanceMode: 'accurate',
          landmarkMode: 'all',
        }
      );

      if (!faceDetectionResult?.length) {
        console.log('No faces detected');
        return;
      }

      if (faceDetectionResult?.length > 1) {
        console.log('Too many faces');
        return;
      }

      const face = faceDetectionResult[0];

      if (!face.frame) {
        console.log('No frame information available for the detected face');
        return;
      }

      if (!face.landmarks) {
        console.log('No landmarks information available for the detected face');
        return
      }
      const { height, width, top, left } = face.frame
      const scalingRatio = {
        width: width / 100,
        height: height / 100,
      }

      const centerPoint = { x: (face.landmarks.noseBase.position.x - left) / scalingRatio.width, y: (face.landmarks.noseBase.position.y - top) / scalingRatio.height }
      const newDistances = Object.entries(face.landmarks!).reduce((result, [key, { position }]) => {
        if (key === 'noseBase') {
          return result
        }
        const newPoint = { x: (position.x - left) / scalingRatio.width, y: (position.y - top) / scalingRatio.height }
        result.push(calculatePointDistance(centerPoint, newPoint))
        return result
      }, [] as number[])

      if (distancesList.current.length) {
        // console.log(newDistances)
        for (const distances of distancesList.current) {
          if (calculateAvgDistance(distances, newDistances) < limitedDistanceValue) {
            return
          }
        }
      }
      // console.log(newDistances)
      distancesList.current.push(newDistances)

      const cropLeft = face.frame.left;
      const cropTop = face.frame.top;
      const cropWidth = face.frame.width;
      const cropHeight = face.frame.height;
      const cropData = {
        offset: { x: cropLeft, y: cropTop },
        size: { width: cropWidth, height: cropHeight },
      };

      const croppedImage = await ImageEditor.cropImage(previewFileUri, cropData);
      const resizedImage = await ImageResizer.createResizedImage(
        croppedImage.uri,
        128,
        128,
        "JPEG",
        60 // chất lượng hình ảnh
      )

      const formData = new FormData();
      formData.append('file', {
        uri: resizedImage.uri,
        name: 'face.jpg',
        type: 'image/jpeg',
      });

      await recognitionApi.addFaces(formData);
      console.log("====================================pictureCount")
      pictureCount.current += 1
      setWaitTime(new Date().getTime());
    } catch (error) {
      console.error('Error detecting face or taking photo:', error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    setShowWarning(false);
    const timer = setTimeout(() => {
      setShowWarning(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [waitTime]);


  useEffect(() => {
    const interval = setInterval(async () => {
      if (pictureCount.current < 5) {
        detectFaceAndTakePicture();
      } else {
        await userApi.hasFaceInput();
        navigate('/home');
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      }
    }, 1000);
    intervalId.current = interval;

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [pictureCount]);


  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      {showWarning && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Xoay đều mặt đi bạn
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  warningContainer: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
  },
  warningText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
