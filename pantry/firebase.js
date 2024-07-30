// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6BCv_YdUe9V9ldYMrkIGRUzKiRWp5mGA",
  authDomain: "hspantryapp-ac1fd.firebaseapp.com",
  projectId: "hspantryapp-ac1fd",
  storageBucket: "hspantryapp-ac1fd.appspot.com",
  messagingSenderId: "608191593769",
  appId: "1:608191593769:web:3b18efceda4cf565748b38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export {app, firestore}