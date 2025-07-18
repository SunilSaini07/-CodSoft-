import { db, auth } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const projectSelect = document.querySelector('select[name="project"]');
  const submitButton = document.querySelector('#addMemberForm .add-btn');

  // Disable the button until projects are loaded
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Loading Projects...';
    submitButton.style.cursor = 'not-allowed';
    submitButton.style.opacity = '0.6';
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadProjects(projectSelect, user.uid, submitButton);
    } else {
      window.location.href = "login.html";
    }
  });

  document.getElementById("addMemberForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const currentUser = auth.currentUser;
    const formData = new FormData(this);
    const memberEmail = formData.get("email").trim();
    const projectId = formData.get("project");

    if (!memberEmail || !projectId) {
      alert("Please provide an email and select a project.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Adding...';

    try {
      if (memberEmail === currentUser.email) {
        throw new Error("You cannot add yourself to a project.");
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", memberEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No user found with that email. Please ask them to register first.");
      }

      const userToAddDoc = querySnapshot.docs[0];
      const userToAddId = userToAddDoc.id;

      const projectDocRef = doc(db, "projects", projectId);
      const projectDocSnap = await getDoc(projectDocRef);

      if (!projectDocSnap.exists()) {
        throw new Error("The selected project could not be found.");
      }

      const projectData = projectDocSnap.data();
      if (projectData.teamMembers && projectData.teamMembers.includes(userToAddId)) {
        throw new Error(`${userToAddDoc.data().fullName} is already a member of this project.`);
      }

      await updateDoc(projectDocRef, {
        teamMembers: arrayUnion(userToAddId)
      });

      alert(`Successfully added ${userToAddDoc.data().fullName} to the project!`);
      window.location.href = "team.html";
    } catch (error) {
      console.error("Error adding team member:", error);
      if (error.code === 'permission-denied') {
        alert("Permission Denied: You do not have permission to perform this action.");
      } else {
        alert(error.message || "Failed to add team member. Please try again.");
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Add Member';
    }
  });
});

async function loadProjects(selectElement, uid, button) {
  try {
    // Query for projects where the current user is a team member
    const projectsQuery = query(collection(db, "projects"), where("teamMembers", "array-contains", uid));
    const projectsSnapshot = await getDocs(projectsQuery);

    selectElement.innerHTML = '<option value="">Select project</option>';
    projectsSnapshot.forEach((doc) => {
      selectElement.innerHTML += `<option value="${doc.id}">${doc.data().title}</option>`;
    });

    // If projects were loaded successfully, enable the submit button
    if (!projectsSnapshot.empty && button) {
      button.disabled = false;
      button.textContent = 'Add Member';
      button.style.cursor = 'pointer';
      button.style.opacity = '1';
    } else if (button) {
      button.textContent = 'No Projects Available';
    }
  } catch (error) {
    console.error("Error loading projects:", error);
    alert("Could not load your projects. Please try again later.");
    if (button) {
      button.textContent = 'Error Loading';
    }
  }
}
