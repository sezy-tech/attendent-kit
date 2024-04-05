import axios from "axios";
import { createStore } from "../core/redux-context";
import userApi from "../api/user.api";
import { User } from "../models/db.model";

interface userState {
    user : {
      _id: string,
      name : string,
      email : string,
      hasFaceInput: boolean,
      hasSpeechInput: boolean,
      role: number,
    };
    verify : {
      faceVerify : boolean,
      speechVerify : boolean,
    }
  }

  const state: userState = {
    user: {
      _id: '',
      name: '',
      email: '',
      hasFaceInput: false,
      hasSpeechInput:false,
      role : 1,
      
    },
    verify : {
      faceVerify: false,
      speechVerify: false
    }
  };

  
export const { useUserStore, UserStoreProvider, userStore } = createStore({
    name: 'user',
    state,
    onMounted: async (state, dispatch) => {
      const userData  = await userApi.getProfile()
      if(userData){
        dispatch((state)=>(
          state.user= userData
        ))
      }
      
    },
    getters: {
     
    },
    actions: {
      setProfile(userdata : any){
        state.user = userdata
      },
      setFaceId(){
        state.user.hasFaceInput= true;
      },
      setSpeechInput(){
        state.user.hasSpeechInput=true;
      }
    },
  });
  