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

const FaceDetector = () => {
  const [image, setImage] = useState<ImageDetails>();
  const [image1, setImage1] = useState<string>();
  const [faces, setFaces] = useState<Face[]>([]);
  const kmeans2 = {
    centroids: [[86, 47.5], [75, 15.666666666666666], [49.666666666666664, 9], [49.6, 30.2], [23.153846153846153, 25.615384615384617], [80, 67.75], [80.5, 30.666666666666668], [69.25, 27.25], [67.6875, 41.1875], [31.5625, 41.0625], [45.42857142857143, 101.85714285714286], [22.25, 79.75], [12.5, 56.5], [45.851851851851855, 77.85185185185185], [62.526315789473685, 81.57894736842105]],
    clusters: [[[86, 43], [86, 52]], [[68, 11], [76, 15], [81, 21]], [[50, 9], [56, 9], [43, 9]], [[58, 26], [57, 31], [42, 31], [41, 26], [50, 37]], [[20, 32], [23, 30], [28, 28], [34, 28], [18, 31], [21, 27], [26, 25], [33, 25], [12, 35], [14, 27], [18, 20], [23, 14], [31, 11]], [[72, 64], [85, 60], [83, 69], [80, 78]], [[81, 31], [78, 27], [79, 33], [76, 30], [84, 28], [85, 35]], [[73, 25], [66, 26], [72, 29], [66, 29]], [[60, 41], [61, 41], [63, 40], [65, 39], [68, 39], [71, 40], [73, 40], [74, 41], [75, 41], [74, 42], [72, 42], [71, 43], [68, 43], [65, 43], [62, 42], [61, 42]], [[24, 41], [25, 40], [26, 40], [28, 39], [31, 39], [34, 39], [37, 40], [39, 41], [39, 41], [38, 42], [37, 42], [34, 43], [32, 43], [29, 43], [27, 42], [25, 42]], [[62, 102], [56, 104], [51, 105], [46, 104], [39, 102], [34, 100], [30, 96]], [[28, 64], [25, 91], [20, 86], [16, 78]], [[14, 69], [12, 61], [12, 52], [12, 44]], [[37, 80], [38, 79], [40, 77], [43, 76], [47, 74], [51, 75], [55, 74], [51, 86], [47, 85], [44, 84], [41, 83], [39, 81], [51, 62], [54, 80], [51, 80], [48, 80], [45, 80], [43, 80], [41, 80], [41, 66], [51, 66], [39, 79], [43, 79], [45, 79], [48, 79], [51, 79], [54, 79]], [[59, 75], [62, 77], [63, 78], [64, 80], [63, 81], [61, 82], [59, 84], [55, 85], [61, 79], [59, 79], [57, 79], [60, 65], [57, 79], [59, 79], [62, 79], [77, 85], [74, 90], [70, 95], [66, 99]]],
  }


  const [landmarks, setLandmarks] = useState<number[][]>()
  // const images = useRef<any>({})
  // const count = useRef(0)
  const images = { "bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_e7fd3396-597f-4a0a-b1e8-717e77f38615.jpg", "center": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_2ceec509-33f0-41b9-9dd8-fff4add3450f.jpg", "left": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_b3ded312-08ad-47ec-82b4-d0d53065543d.jpg", "left_bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_7c72e9a5-1ac5-4120-b407-75e74b9ddfcb.jpg", "right": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_3ffcff65-8fd6-40ac-9d7e-dbd6ceba17ea.jpg", "right_bottom": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_3e17c530-f401-4bb8-85ed-fa796b8986a3.jpg", "top": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_b463c465-dc4c-4b9c-a0fd-050b9d77b9fb.jpg", "top_left": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_fa28d33c-8be7-4d8e-852c-7b6dfe5da570.jpg", "top_right": "file:///data/user/0/com.attendentkit/cache/rn_image_picker_lib_temp_afd367b1-7db4-46fc-9af9-423fc7fc15ba.jpg" }

  const [face, setFace] = useState<Face>()
  const targetDistances = [26.65950953494805, 23.822590634332396, 23.195683806325963, 24.30919293693549, 27.299341677703406, 25.88332963783173, 32.9412075850535, 24.999718115210598, 39.962105251256204]
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const faces = [] as any
    console.log('++++++++++++++')
    // Object.entries(images).forEach(async ([key,image], index) => {
    Object.values(images).slice(count, count + 1).forEach(async (image, index) => {
      processImage(image)
    })
  }, [count])

  const processImage = async (image: string) => {
    const result = await FaceDetection.detect(image, {
      landmarkMode: 'all',
      // contourMode: 'all',
    });
    setImage1(image)
    result.forEach((face, faceIndex) => {
      // console.log('=================', index, '--', faceIndex)
      // console.log(face.frame)
      if (!face.landmarks) {
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        console.log('ERROPOODDSADSFSDEF')
        return
      }
      // console.log(face.landmarks)
      const { height, width, top, left } = face.frame
      const scalingRatio = {
        width: width / 100,
        height: height / 100,
      }
      console.log('====++++++++++')
      console.log('====++++++++++')
      console.log('====++++++++++')
      const newData = Object.entries(face.landmarks!).reduce((result, [key, { position }]) => {
        result.push([Math.round((position.x - left) / scalingRatio.width), Math.round((position.y - top) / scalingRatio.height)])
        return result
      }, [] as number[][])

      const centerPoint = { x: (face.landmarks.noseBase.position.x - left) / scalingRatio.width, y: (face.landmarks.noseBase.position.y - top) / scalingRatio.height }
      const newData2 = Object.entries(face.landmarks!).reduce((result, [key, { position }]) => {
        if (key === 'noseBase') {
          return result
        }
        const newPoint = { x: (position.x - left) / scalingRatio.width, y: (position.y - top) / scalingRatio.height }
        result.push(calculatePointDistance(centerPoint, newPoint))
        return result
      }, [] as number[])
      console.log(newData2)
      console.log(calculateAvgDistance(targetDistances, newData2))

      // setLandmarks(newData)
      // setLandmarks(lm => [...(lm ?? []), [
      //   Math.round((face.landmarks?.noseBase.position.x! - left) / scalingRatio.width),
      //   Math.round((face.landmarks?.noseBase.position.y! - top) / scalingRatio.height),
      // ]])
    })
  }
  const handleChoose = async (currentImage: ImageDetails) => {

    processImage(currentImage.path)
  };

  // const DrawPoint = ()=>{
  //   {face?.landmarks?.leftCheek?.map(([x, y], index) => (
  //     <>
  //       <Circle
  //         key={`point-${index}`}
  //         cx={x}
  //         cy={y}
  //         r="3"
  //         fill="blue"
  //       />
  //     </>
  //   ))}
  // }

  const device = useCameraDevice('front')

  if (device == null) return <Text>No Camera</Text>

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      console.log({ status })
    })()
  }, [device])

  
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    // Your frame processing logic here
    // For example, converting the frame to an image, analyzing it, etc.

    // If you need to trigger a state update or call a function outside of the worklet,
    // use runOnJS to run a function on the JavaScript thread.
    // Example:
    // runOnJS(yourFunctionHere)(yourDataHere);
  }, []);
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
    />
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
