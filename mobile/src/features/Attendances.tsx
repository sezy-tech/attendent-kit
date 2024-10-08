import { ScrollView, Text, View } from "react-native";
import { useUserStore } from "../store/user.store";
import { useRouter } from "../store/router.store";
import { useEffect, useState } from "react";
import authApi from "../api/auth.api";
import userAttendanceApi from "../api/user-attendance.api";

const Attendances = () => {
  const userStore = useUserStore();
  const { navigate } = useRouter();
  const [visible, setVisible] = useState(false);
  const [userAttendances, setUserAttendances] = useState([]);

  const getUserAttendances = async () => {
    try {
      const userAttendances = await userAttendanceApi.get();
      setUserAttendances(userAttendances ?? [])
    } catch (err) {
    }
  };

  useEffect(() => {
    getUserAttendances();
  }, [])

  return (
    <ScrollView style={{ height: '100%', paddingHorizontal: 16, gap: 8, marginVertical: 16, }}>
      {userAttendances.map((userAttendance: any, index) => (
        <View key={index} style={{ marginTop: 8, flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 4, paddingVertical: 16, paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 16 }}>Course ID: {userAttendance.courseId}</Text>
          <Text style={{ fontSize: 16 }}>{new Date(userAttendance.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  )
};

export default Attendances;
