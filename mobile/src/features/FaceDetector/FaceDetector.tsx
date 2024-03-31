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
  const [isScaning, setScanning] = useState(true)
  const [isSuccess, setSuccess] = useState(false)
  const intervalId = useRef<NodeJS.Timeout>()
  const [image, setImage] = useState<ImageDetails>();
  const [image1, setImage1] = useState<string>();

  const [landmarks, setLandmarks] = useState<number[][][]>()
  // const images = useRef<any>({})
  // const count = useRef(0)
  const images = { "bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_e7fd3396-597f-4a0a-b1e8-717e77f38615.jpg", "center": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_2ceec509-33f0-41b9-9dd8-fff4add3450f.jpg", "left": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_b3ded312-08ad-47ec-82b4-d0d53065543d.jpg", "left_bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_7c72e9a5-1ac5-4120-b407-75e74b9ddfcb.jpg", "right": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_3ffcff65-8fd6-40ac-9d7e-dbd6ceba17ea.jpg", "right_bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_3e17c530-f401-4bb8-85ed-fa796b8986a3.jpg", "top": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_b463c465-dc4c-4b9c-a0fd-050b9d77b9fb.jpg", "top_left": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_fa28d33c-8be7-4d8e-852c-7b6dfe5da570.jpg", "top_right": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_afd367b1-7db4-46fc-9af9-423fc7fc15ba.jpg" }

  const [face, setFace] = useState<Face>()
  const targetDistances = [26.65950953494805, 23.822590634332396, 23.195683806325963, 24.30919293693549, 27.299341677703406, 25.88332963783173, 32.9412075850535, 24.999718115210598, 39.962105251256204]
  const [count, setCount] = useState<number>(0);
  const [number, setNumber] = useState<number>(0);

  const landmarkPoints = useRef<number[][][]>([])

  const target = [[53.67827814275568, 87.56050248579545], [68.23191139914773, 80.52951882102273], [77.369384765625, 65.90021306818181], [52.80758389559659, 58.48880282315341], [68.55708451704545, 40.65663840553977], [32.05854936079545, 40.57816938920455], [25.63418856534091, 66.00152033025569], [88.74479536576705, 54.72749467329545], [37.90138938210227, 81.2259188565341], [9.729037198153408, 56.91582697088068]]
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
