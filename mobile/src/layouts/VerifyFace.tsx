import FaceDetection from "@react-native-ml-kit/face-detection";
import { useContext, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import recognitionApi from "../api/recognition.api";
import { useRouter } from "../store/router.store";
import { useUserStore } from "../store/user.store";
import ImageResizer from "react-native-image-resizer";
import ImageEditor from "@react-native-community/image-editor";
import { calculateAvgDistance, calculatePointDistance } from '../helpers/face-landmark.helper';
import userAttendanceApi from "../api/user-attendance.api";
import AppContext from "../context/AppContext";

export default function VerifyFace() {
  const [isSuccess, setSuccess] = useState(false)
  const intervalId = useRef<NodeJS.Timeout>()
  const user = useUserStore();
  const { navigate } = useRouter()
  const appContext = useContext(AppContext);

  const cameraRef = useRef<Camera>(null)
  const device = useCameraDevice('front')
  
  if (device == null) return <Text>No Camera</Text>
  const takePicture2 = async () => {
    console.log("====================================takePicture2")
    if (!cameraRef.current) return;

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
      }
    );

    if (!faceDetectionResult?.length || faceDetectionResult?.length > 1) {
      return;
    }

    const face = faceDetectionResult[0];

    if (!face.frame) {
      return;
    }

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

    const rsp = await recognitionApi.verifyFace2(formData);
    // console.log('Response:', rsp);
    if (Boolean(rsp?.match)) {
      clearInterval(intervalId.current);

      console.log(appContext?.courseId)
      console.log('Face verified successfully');
      userAttendanceApi.create(appContext?.courseId as string, user.data.state.user.studentId);
      navigate('/home');
    }
  };
  const handleFaceVerify = () => {
    intervalId.current = setInterval(takePicture2, 1000);
  };

  useEffect(() => {
    handleFaceVerify();
    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  const exit = () => {
    navigate('/home')
  }

  return (
    <View style={[
      styles.container,
      {
        // Try setting `flexDirection` to `"row"`.
        flexDirection: 'column',
        gap: 10
      },
    ]}
    // onTouchEnd={exit}
    >
      <Text>Verify Face</Text>
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