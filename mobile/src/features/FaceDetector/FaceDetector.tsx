import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import FaceDetection, { Face } from '@react-native-ml-kit/face-detection';

import PreviewImage from '../../core/PreviewImage';
import ChooseImageButton, { ImageDetails } from '../../core/ChooseImageButton';
import OptionSwitch from '../../core/OptionSwitch';
import kmeans, { getKmeansDistance } from '../../helpers/kmeans.helper';
import { Svg, Circle } from 'react-native-svg';
import { calculateAvgDistance, calculatePointDistance } from '../../helpers/face-landmark.helper';

import {
  useCameraDevices,
  useFrameProcessor,
  Camera,
  useCameraDevice,
  Frame,
} from 'react-native-vision-camera';
import { calculateEuclideanDistance } from './faceDetector.helpers';

const limitedDistanceValue = 2

const FaceDetector = () => {
  const [isSuccess, setSuccess] = useState(false)
  const intervalId = useRef<NodeJS.Timeout>()
  const [image1, setImage1] = useState<string>();
  const [number, setNumber] = useState<number>(0);

  const landmarkPoints = useRef<number[][][]>([])

  const processImage = async (image: string) => {
    const faces = await FaceDetection.detect(image, {
      landmarkMode: 'all',
    });
    console.log('--------------------')
    setImage1(image)
    for (const face of faces) {
      if (!face.landmarks) {
        console.log('ERROPOODDSADSFSDEF')
        return
      }

      const { height, width, top, left } = face.frame
      const scalingRatio = {
        width: width / 100,
        height: height / 100,
      }

      const newLandmarkPoint = Object.entries(face.landmarks!).reduce((result, [key, { position }]) => {
        const newPoint = [(position.x - left) / scalingRatio.width, (position.y - top) / scalingRatio.height]
        result.push(newPoint)
        return result
      }, [] as number[][])


      for (const landmarkPoint of landmarkPoints.current) {
        const d = calculateEuclideanDistance(landmarkPoint, newLandmarkPoint)
        if (d < 2) {
          console.log(d)
          return
        }
      }
      landmarkPoints.current.push(newLandmarkPoint)
      
      setNumber(landmarkPoints.current.length)
      setImage1(image)
      // console.log(landmarkPoints.current)
      // console.log(calculateEuclideanDistance(newLandmarkPoint, target))
    }
  }

  const processImage2 = async (image: string) => {
    const result = await FaceDetection.detect(image, {
      landmarkMode: 'all',
    });
    console.log('--------------------')
    setImage1(image)
    result.forEach((face, faceIndex) => {
      if (!face.landmarks) {
        console.log('ERROPOODDSADSFSDEF')
        return
      }
      const { height, width, top, left } = face.frame
      const scalingRatio = {
        width: width / 100,
        height: height / 100,
      }

      const newLandmarkPoint = Object.entries(face.landmarks!).reduce((result, [key, { position }]) => {
        const newPoint = [(position.x - left) / scalingRatio.width, (position.y - top) / scalingRatio.height]
        result.push(newPoint)
        return result
      }, [] as number[][])

      for (const landmarkPoint of landmarkPoints.current) {
        const d = calculateEuclideanDistance(landmarkPoint, newLandmarkPoint)
        if (d < 2) {
          console.log(d)
          // landmarkPoints.current.push(newLandmarkPoint)
          setNumber(landmarkPoints.current.length)
          setImage1(image)
          setSuccess(true)

          if (intervalId.current) {
            clearInterval(intervalId.current)
          }
          return
        }
      }
    })
  }

  const device = useCameraDevice('front')

  if (device == null) return <Text>No Camera</Text>

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
    })()
  }, [device])

  const cameraRef = useRef<Camera>(null)
  const takePicture = async () => {
    if (!cameraRef.current) return
    const photo = await cameraRef.current.takePhoto({ enableShutterSound: false })
    console.log(`file:///${photo.path}`)
    const path = `file:///${photo.path}`
    setImage1(path)
    processImage(path)
  };
  const takePicture2 = async () => {
    if (!cameraRef.current) return
    const photo = await cameraRef.current.takePhoto({ enableShutterSound: false })
    console.log(`file:///${photo.path}`)
    const path = `file:///${photo.path}`
    processImage2(path)
  };

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
    }
  }, [])

  const handleFaceInput = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current)
    }
    intervalId.current = setInterval(takePicture, 1000)
  }

  const handleFaceVerify = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current)
    }
    // console.log(distancesList)
    setSuccess(false)
    intervalId.current = setInterval(takePicture2, 1000)
  }

  return (
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
          gap: 10
        },
      ]}
    >
      <Text>111</Text>
      {/* <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      /> */}
      {/* <ChooseImageButton onChoose={handleChoose} /> */}
      {/* {image1 && <PreviewImage source={image1} />}
      <Text>{String(number)}</Text>
      {isSuccess && <Text>Success</Text>} */}
      <Button title={'Face Input'} onPress={handleFaceInput} />
      <Button title={'Face Verify'} onPress={handleFaceVerify} />
    </View>
  )
};

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
});

export default FaceDetector;
