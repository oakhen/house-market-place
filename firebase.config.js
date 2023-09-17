import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRvy3I4-Gp5Ftmgpwe9X28UNqQ14TtB48",
  authDomain: "house-market-place-app-fd15b.firebaseapp.com",
  projectId: "house-market-place-app-fd15b",
  storageBucket: "house-market-place-app-fd15b.appspot.com",
  messagingSenderId: "163214488314",
  appId: "1:163214488314:web:1badc21eeedb3f3fb58f43",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app) 
