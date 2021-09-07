import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import './index.css';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDyoV4oFFFbXcSjUPeKbqpJrM1a1X12m_8',
  authDomain: 'ccm-english.firebaseapp.com',
  projectId: 'ccm-english',
  storageBucket: 'ccm-english.appspot.com',
  messagingSenderId: '1006817124710',
  appId: '1:1006817124710:web:9825e70910a29b74f668a7',
  measurementId: 'G-BLXM5NVNYK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
