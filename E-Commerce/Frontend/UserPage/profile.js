onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../AuthPage/auth.html";
  } else {
    document.getElementById("user-name").textContent = user.displayName || "User";
    document.getElementById("user-email").textContent = user.email;
  }
});


import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
   
    document.getElementById("user-name").textContent = user.displayName || "User";
    document.getElementById("user-email").textContent = user.email;
  } else {
    window.location.href = "../AuthPage/auth.html";
  }
});
