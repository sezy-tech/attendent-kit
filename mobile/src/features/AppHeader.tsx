import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { useUserStore } from "../store/user.store";
import { useRouter } from "../store/router.store";
import Drawer from "../components/Drawer";
import { useState } from "react";
import Icon from "../components/Icon";
import authApi from "../api/auth.api";
import Button from "../components/Button";

const AppHeader = () => {
  const userStore = useUserStore();
  const { navigate } = useRouter();
  const [visible, setVisible] = useState(false);

  const logOut = () => {
    console.log(userStore.actions); // Check if clearState exists here
    try {
      authApi.logout();
      console.log('Logged out');
    } catch (err) {
      console.log('Error clearing state:', err);
    }
    navigate('/login');
  };

  return (
    <>
      <View style={{ flexDirection: 'row', backgroundColor: '#55abd4', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 60 }}>
        {/* <Image source={require('../../assets/images/logo.jpeg')} style={{ borderRadius: 8, width: 50, height: 50, marginBottom: 38 }} /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>AAS</Text>
          <Text style={{ fontSize: 12, marginLeft: 8, color: 'white' }}>v1.0.0</Text>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setVisible(true)}>
          <Avatar.Image
            size={40}
            source={require('../../assets/images/avt.png')}
          />
        </TouchableOpacity>
      </View>
      <Drawer visible={visible} onRequestClose={() => setVisible(false)} >
        <View style={{ flexDirection: 'row', backgroundColor: '#ccc', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 60 }}>
          <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}> Hi {userStore.data.state.user.name}</Text>
          {/* <TouchableOpacity onPress={() => setVisible(false)}>
            <Icon name="times" />
          </TouchableOpacity> */}
        </View>
        <View style={{ flex:1, padding: 16, justifyContent: 'space-between' }}>
          <View style={{ flex: 1,}}></View>
          <Button onPress={logOut} style={{ backgroundColor: '#e8385b', padding: 12, marginBottom: 16, borderRadius: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: 'white' }}>Logout</Text>
              <Icon name="times" fill='white' width={20} />
            </View>
          </Button>
        </View>
      </Drawer >
    </>
  )
};

export default AppHeader;
