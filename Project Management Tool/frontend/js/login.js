import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

   
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
   
      const nameFromEmail = user.email.split('@')[0];
      await setDoc(doc(db, "users", user.uid), {
        fullName: nameFromEmail,
        email: user.email,
      });
      console.log(`Created missing user document for UID: ${user.uid}`);
    }

    alert("Login Successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login Failed : " + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});
