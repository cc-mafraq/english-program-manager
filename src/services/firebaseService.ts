import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyoV4oFFFbXcSjUPeKbqpJrM1a1X12m_8",
  appId: "1:1006817124710:web:9825e70910a29b74f668a7",
  authDomain: "ccm-english.firebaseapp.com",
  measurementId: "G-BLXM5NVNYK",
  messagingSenderId: "1006817124710",
  projectId: "ccm-english",
  storageBucket: "ccm-english.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
