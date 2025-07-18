// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdL5BLbxTDa6xC3yvNN3GzMPImp1nXtWA",
  authDomain: "e-shop-7f4b1.firebaseapp.com",
  projectId: "e-shop-7f4b1",
  storageBucket: "e-shop-7f4b1.firebasestorage.app",
  messagingSenderId: "243080238638",
  appId: "1:243080238638:web:9d54cc4dfd338ed457b1bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth};