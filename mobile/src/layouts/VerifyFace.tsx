import FaceDetection from "@react-native-ml-kit/face-detection";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { calculateEuclideanDistance } from "../features/FaceDetector/faceDetector.helpers";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import recognitionApi from "../api/recognition.api";
import { useRouter } from "../store/router.store";
import { useUserStore } from "../store/user.store";
export default function VerifyFace(){
    const [isSuccess, setSuccess] = useState(false)
    const intervalId = useRef<NodeJS.Timeout>()
    const [image1, setImage1] = useState<string>();
    const [number, setNumber] = useState<number>(0);
    const landmarkPoints = useRef<number[][][]>([])
    const userData = useUserStore();
    const {navigate} = useRouter()
    const processImage2 = async (image: string) => {
        const result = await FaceDetection.detect(image, {
          landmarkMode: 'all',
        });
        console.log('--------------------')
        setImage1(image)
        result.forEach(async (face, faceIndex) => {
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
              landmarkPoints.current.push(newLandmarkPoint)
              // setNumber(landmarkPoints.current.length)
              // setImage1(image)
              // setSuccess(true)
              return
            }
          }
          console.log(newLandmarkPoint)
          const verifyResult = await recognitionApi.verifyFace(newLandmarkPoint)
        if(verifyResult){
         
          userData.data.state.verify.faceVerify = true;
          navigate('/onboarding')
        }
        })
      }
      const cameraRef = useRef<Camera>(null)
      const device = useCameraDevice('front')
      if (device == null) return <Text>No Camera</Text>
      const takePicture2 = async () => {
        if (!cameraRef.current) return
        const photo = await cameraRef.current.takePhoto({ enableShutterSound: false })
        const path = `file:///${photo.path}`
        processImage2(path)
      };
      const handleFaceVerify = () => {
        // if (intervalId.current) {
        //   clearInterval(intervalId.current)
        // }
        // // console.log(distancesList)
        // setSuccess(false)
        // intervalId.current = setInterval(takePicture2, 1000)
        
        intervalId.current = setInterval(takePicture2, 1000);
      }
      useEffect(()=>{
        handleFaceVerify()
        return ()=>{
          clearInterval(intervalId.current);
        }
      },[])
  

    return(
        <View  style={[
            styles.container,
            {
              // Try setting `flexDirection` to `"row"`.
              flexDirection: 'column',
              gap: 10
            },
          ]}>
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