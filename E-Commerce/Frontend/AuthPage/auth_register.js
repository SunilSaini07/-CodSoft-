import { auth } from "../firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.registerUser = async function () {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const statusText = document.getElementById("statusText");

  if (password !== confirmPassword) {
    statusText.textContent = "Passwords do not match.";
    statusText.style.color = "red";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });

    alert("Account created successfully!");
    window.location.href = "auth.html";
  } catch (error) {
    statusText.textContent = error.message;
    statusText.style.color = "red";
  }
};
