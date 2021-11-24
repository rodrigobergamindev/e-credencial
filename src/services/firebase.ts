// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD69QvbYJY9V0hiWaJsIJru3AYZOOEWImo",
  authDomain: "autocertocars.firebaseapp.com",
  projectId: "autocertocars",
  storageBucket: "autocertocars.appspot.com",
  messagingSenderId: "1048673224893",
  appId: "1:1048673224893:web:d6a8c549a32548e1ba0fd4"
};

// Initialize Firebase


const firebaseApp = initializeApp(firebaseConfig)

export const storage = getStorage(firebaseApp)




