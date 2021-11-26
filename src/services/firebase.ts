// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCEWne8ZsFLeRKXVM4_aNYZNLStE6c3U8",
  authDomain: "ecredencial-eef66.firebaseapp.com",
  projectId: "ecredencial-eef66",
  storageBucket: "ecredencial-eef66.appspot.com",
  messagingSenderId: "523153703351",
  appId: "1:523153703351:web:aa2d5ffe2a05daae11e832"
};

// Initialize Firebase


const firebaseApp = initializeApp(firebaseConfig)

export const storage = getStorage(firebaseApp)




