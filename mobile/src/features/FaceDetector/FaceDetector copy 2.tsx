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

const limitedDistanceValue = 2

const FaceDetector = () => {
  const [isScaning, setScanning] = useState(true)
  const [isSuccess, setSuccess] = useState(false)
  const intervalId = useRef<NodeJS.Timeout>()
  const [image, setImage] = useState<ImageDetails>();
  const [image1, setImage1] = useState<string>();

  const [landmarks, setLandmarks] = useState<number[][]>()
  // const images = useRef<any>({})
  // const count = useRef(0)
  const images = { "bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_e7fd3396-597f-4a0a-b1e8-717e77f38615.jpg", "center": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_2ceec509-33f0-41b9-9dd8-fff4add3450f.jpg", "left": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_b3ded312-08ad-47ec-82b4-d0d53065543d.jpg", "left_bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_7c72e9a5-1ac5-4120-b407-75e74b9ddfcb.jpg", "right": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_3ffcff65-8fd6-40ac-9d7e-dbd6ceba17ea.jpg", "right_bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_3e17c530-f401-4bb8-85ed-fa796b8986a3.jpg", "top": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_b463c465-dc4c-4b9c-a0fd-050b9d77b9fb.jpg", "top_left": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_fa28d33c-8be7-4d8e-852c-7b6dfe5da570.jpg", "top_right": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_afd367b1-7db4-46fc-9af9-423fc7fc15ba.jpg" }

  const [face, setFace] = useState<Face>()
  const targetDistances = [26.65950953494805, 23.822590634332396, 23.195683806325963, 24.30919293693549, 27.299341677703406, 25.88332963783173, 32.9412075850535, 24.999718115210598, 39.962105251256204]
  const [count, setCount] = useState<number>(0);
  const [number, setNumber] = useState<number>(0);

  const distancesList = useRef<number[][]>([])

  const processImage = async (image: string) => {
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
        console.log(newDistances)
        for (const distances of distancesList.current) {
          if (calculateAvgDistance(distances, newDistances) < limitedDistanceValue) {
            return
          }
        }
      }
      console.log(newDistances)
      distancesList.current.push(newDistances)
      setNumber(distancesList.current.length)
    })
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

      const centerPoint = { x: (face.landmarks.noseBase.position.x - left) / scalingRatio.width, y: (face.landmarks.noseBase.position.y - top) / scalingRatio.height }
      const newDistances = Object.entries(face.landmarks!).reduce((result, [key, { position }]) => {
        if (key === 'noseBase') {
          return result
        }
        const newPoint = { x: (position.x - left) / scalingRatio.width, y: (position.y - top) / scalingRatio.height }
        result.push(calculatePointDistance(centerPoint, newPoint))
        return result
      }, [] as number[])

      for (const distances of distancesList.current) {
        const d = calculateAvgDistance(distances, newDistances)
        if (d < 1) {
          console.log(d)
          setNumber(distancesList.current.length)
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


  const handleChoose = async (currentImage: ImageDetails) => {

    processImage(currentImage.path)
  };

  const device = useCameraDevice('front')

  if (device == null) return <Text>No Camera</Text>

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      // console.log({ status })
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
    console.log(distancesList)
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
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      {/* <ChooseImageButton onChoose={handleChoose} /> */}
      {image1 && <PreviewImage source={image1} />}
      <Text>{String(number)}</Text>
      {isSuccess && <Text>Success</Text>}
      <Button title="pres1231232s" onPress={takePicture} />
      <Button title={'Face Input'} onPress={handleFaceInput} />
      <Button title={'Face Verify'} onPress={handleFaceVerify} />
    </View>
  )
  return (
    <ScrollView>

      <View style={styles.container}>
        <ChooseImageButton onChoose={handleChoose} />

        {/* {image && (
        <View style={styles.imageContainer}>
          <PreviewImage source={image.path} />
        </View>
      )} */}

        <View
          style={[
            styles.container,
            {
              // Try setting `flexDirection` to `"row"`.
              flexDirection: 'row',
              gap: 10
            },
          ]}>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => <Button onPress={() => setCount(n)} title={'' + n} key={n} />)
          }
        </View>
        {image1 && <PreviewImage source={image1} />}

        <View style={{ width: 100, height: 100, borderColor: 'red', borderWidth: 1 }}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100">
            {landmarks && landmarks.map(([x, y], index) => (
              <>
                <Circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="blue"
                />
              </>
            ))}
          </Svg>
        </View>
        {/* 
      <View style={{ width: 200, height: 200, borderColor: 'red', borderWidth: 1 }}>
        <Svg height="100%" width="100%" viewBox="0 0 200 200">
          {centroids.map(([x, y], index) => (
            <>
              <Circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="3"
                fill="blue"
              />
            </>
          ))}
        </Svg>
      </View>
      <View style={{ width: 200, height: 200, borderColor: 'red', borderWidth: 1 }}>
        <Svg height="100%" width="100%" viewBox="0 0 200 200">
          {clusters.map((cluster, index) => (
            <>
              <Circle
                key={`center-${index}`}
                cx={0}
                cy={0}
                r="2"
                fill="red"
              />
              {cluster.map(([x, y], pointIndex) => (
                <Circle
                  key={`point-${index}-${pointIndex}`}
                  cx={x}
                  cy={y}
                  r="1"
                  fill="blue"
                />
              ))}
            </>
          ))}
        </Svg>
      </View> */}
      </View>
    </ScrollView >
  );
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
