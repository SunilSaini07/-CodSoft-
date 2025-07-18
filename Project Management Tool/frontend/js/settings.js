import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadUserData(user);
    } else {
      window.location.href = "login.html";
    }
  });

  const emailToggle = document.getElementById('emailToggle');
  const inAppToggle = document.getElementById('inAppToggle');

  emailToggle.checked = localStorage.getItem('emailNotif') === 'true';
  inAppToggle.checked = localStorage.getItem('inAppNotif') === 'true';

  emailToggle.addEventListener('change', () => {
    localStorage.setItem('emailNotif', emailToggle.checked);
  });

  inAppToggle.addEventListener('change', () => {
    localStorage.setItem('inAppNotif', inAppToggle.checked);
  });

  const saveBtn = document.getElementById('save-settings-btn');
  if (saveBtn) {
  }

  async function loadUserData(user) {
    const fullNameSpan = document.getElementById("full-name");
    const emailSpan = document.getElementById("email");

    if (!fullNameSpan || !emailSpan) {
      console.error("Could not find the name or email span elements on the page.");
      return;
    }
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        fullNameSpan.textContent = userData.fullName || "Name not set";
        emailSpan.textContent = userData.email || "Email not set";
      } else {
        console.error("No user document found for UID:", user.uid);
        fullNameSpan.textContent = "User data not found.";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      fullNameSpan.textContent = "Error loading data.";
      emailSpan.textContent = "Error loading data.";
    }
  }
});
