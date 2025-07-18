import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5gUoQsS3REIAL3UZpi_ct3o2LhPSNTeA",
  authDomain: "projectmanagementtool-a7d20.firebaseapp.com",
  projectId: "projectmanagementtool-a7d20",
  storageBucket: "projectmanagementtool-a7d20.firebasestorage.app",
  messagingSenderId: "588578335695",
  appId: "1:588578335695:web:03d8d116617a5ed62d80ba"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

