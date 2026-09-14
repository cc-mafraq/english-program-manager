import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseProdConfig = {
  apiKey: "AIzaSyBeUcf_nQ6RoG518jJXT9eLm8J2ByIiUFQ",
  appId: "1:1003787032022:web:591c5ed536ebca8f43c077",
  authDomain: "ccmenglishprogram.firebaseapp.com",
  measurementId: "G-58WFZ414WQ",
  messagingSenderId: "1003787032022",
  projectId: "ccmenglishprogram",
  storageBucket: "ccmenglishprogram.firebasestorage.app",
};

const firebaseDevConfig = {
  apiKey: "AIzaSyBWYcxes1Ozhp8XANNegcAQOFpvSDdab2k",
  appId: "1:563679619638:web:45465cd26144608fc3c697",
  authDomain: "ccm-english-dev.firebaseapp.com",
  measurementId: "G-TT5H32705E",
  messagingSenderId: "563679619638",
  projectId: "ccm-english-dev",
  storageBucket: "ccm-english-dev.appspot.com",
};

export const isProd =
  window.location.hostname.includes("ccmenglishprogram.web.app") ||
  window.location.hostname.includes("ccmenglishprogram.firebaseapp.com");

// Initialize Firebase
// export const app = initializeApp(firebaseProdConfig);
export const app = initializeApp(isProd ? firebaseProdConfig : firebaseDevConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
export const storage = getStorage(app);

export const studentImageFolder = "studentPics/";
// export const covidVaccineImageFolder = "vaccineCertificates/";
