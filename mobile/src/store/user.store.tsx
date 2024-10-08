import axios from 'axios';
import {createStore} from '../core/redux-context';
import userApi from '../api/user.api';
import {User} from '../models/db.model';

interface userState {
  user: {
    _id: string;
    name: string;
    studentId: string;
    tagId: string;
    email: string;
    labelNumber: string;
    phone: string;
    hasFaceInput: boolean;
    hasSpeechInput: boolean;
    role: number;
    courseId?:string
  };
  verify: {
    faceVerify: boolean;
    speechVerify: boolean;
  };
  deviceid: string;
}

const state: userState = {
  user: {
    _id: '',
    name: '',
    studentId: '',
    tagId: '',
    email: '',
    phone: '',
    labelNumber: '',
    hasFaceInput: false,
    hasSpeechInput: false,
    role: 1,
  },
  verify: {
    faceVerify: false,
    speechVerify: false,
  },
  deviceid: '',
};

export const {useUserStore, UserStoreProvider, userStore} = createStore({
  name: 'user',
  state,
  onMounted: async (state, dispatch) => {
    const userData = await userApi.getProfile();
    if (userData) {
      dispatch(state => (state.user = userData));
    }
  },
  getters: {},
  actions: {
    setProfile(userdata: any) {
      state.user = userdata;
    },
    setFaceId() {
      state.user.hasFaceInput = true;
    },
    setSpeechInput() {
      state.user.hasSpeechInput = true;
    },
    setDeviceId(value: string) {
      state.deviceid = value;
    },
    setCourseId(value: string) {
      console.log("====================================")
      console.log("====================================")
      console.log("====================================")
      console.log("====================================")
      console.log("====================================")
      console.log("====================================")
      console.log(value)
      state.user = {
        ...state.user,
        courseId: value,
      };
    },
    clearState() {
      return state;
    },
  },
});
