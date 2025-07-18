import { auth } from "../firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    window.location.href = "../UserPage/profile.html"; 
  } catch (error) {
    alert("Login Failed : " + error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "../UserPage/profile.html";
  }
});

// close button functionality
document.querySelector('.close-btn').addEventListener('click', function () {
  window.location.href = '../HomePage/index.html';
});
