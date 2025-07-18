import { auth, db } from "./firebase-config.js";
import {   createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fullName = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (!fullName || !email || !password || !confirmPassword) {
    alert('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if(user) {
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName,
      email: email,
    });
  }
    alert(`Account created for: ${fullName}`);
    window.location.href = "login.html"; 
  } catch (error) {
    alert(error.message);
  }
});
