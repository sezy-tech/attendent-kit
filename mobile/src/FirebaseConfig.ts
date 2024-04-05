import { initializeApp , getApp} from "firebase/app";
import { getAuth, initializeAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAN9b74cLgH5_pgPlwgDaCz1JxcUMddNBM",
  authDomain: "khang-ad7e6.firebaseapp.com",
  projectId: "khang-ad7e6",
  storageBucket: "khang-ad7e6.appspot.com",
  messagingSenderId: "1036500718591",
  appId: "1:1036500718591:web:0848dc346926708a840dca",
  measurementId: "G-09TF4TBX3X"
};
// const firebaseApp = getApp();
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const storage = getStorage(FIREBASE_APP, "gs://khang-ad7e6.appspot.com");
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIREBASE_DB = getFirestore(FIREBASE_APP)