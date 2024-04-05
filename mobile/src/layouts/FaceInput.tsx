import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { calculateEuclideanDistance } from "../features/FaceDetector/faceDetector.helpers";
import FaceDetection from "@react-native-ml-kit/face-detection";
import { Camera, useCameraDevice } from "react-native-vision-camera";

import axios from "axios";
import recognitionApi from "../api/recognition.api";
import { useUserStore, userStore } from "../store/user.store";
import { useRouter } from "../store/router.store";

export default function FaceInput(){
  const { navigate } = useRouter()
    const [isSuccess, setSuccess] = useState(false)
    const intervalId = useRef<NodeJS.Timeout>()
    const [image1, setImage1] = useState<string>();
    const [number, setNumber] = useState<number>(0);
    const landmarkPoints = useRef<number[][][]>([])
    const [landmark, setlandmark] = useState<number[][]>([])
const userStore = useUserStore()
  const dispatch = useUserStore()
    const processImage = async (image: string) => {
      const faces = await FaceDetection.detect(image, {
        landmarkMode: 'all',
      });
      console.log('--------------------')

      // setImage1(image)
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
          console.log(newPoint)
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
        const hasFaceInput = await recognitionApi.addFace(newLandmarkPoint);
        

    if (hasFaceInput) {
      console.log('Face added successfully');
      clearInterval(intervalId.current);
        navigate('/onboarding')
    }
     
    
        // setNumber(landmarkPoints.current.length)
        // setImage1(image)
        // console.log('current'+landmarkPoints.current)
        // console.log(calculateEuclideanDistance(newLandmarkPoint, target))
      }
    }
    const device = useCameraDevice('front')
    if (device == null) return <Text>No Camera</Text>
    const cameraRef = useRef<Camera>(null)
    const takePicture = async () => {
      if (!cameraRef.current) return
      const photo = await cameraRef.current.takePhoto({ enableShutterSound: false })
      console.log(`file:///${photo.path}`)
      const path = `file:///${photo.path}`
      // setImage1(path)
    processImage(path)
    };
    const handleFaceInput = async () => {
      intervalId.current = setInterval(takePicture, 1000);
    };
   
  useEffect(() => {
    handleFaceInput()
  }, [])

 
    return(
   
    <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    }}
  >
         <Camera
           ref={cameraRef}
           style={StyleSheet.absoluteFill}
           device={device}
           isActive={true}
           photo={true}
         /> 
         </View>
    )
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
  });