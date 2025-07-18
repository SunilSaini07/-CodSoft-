import { auth } from "../firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../AuthPage/auth.html";
  }
});
// Placeholder JS for interactivity if needed in future
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    alert(`Filtering by: ${btn.textContent}`);
  });
});
