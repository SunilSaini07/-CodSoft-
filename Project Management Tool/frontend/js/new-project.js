import { auth, db } from "./firebase-config.js";
import { addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const teamSelect = document.getElementById('team');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUsers(teamSelect);
        } else {
            window.location.href = 'login.html';
        }
    });

    document.getElementById("projectForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("You must be logged in to create a project.");
            return;
        }

        const title = document.getElementById("projectName").value;
        const description = document.getElementById("description").value;
        const deadline = document.getElementById("deadline").value;
        
        const selectedTeamUids = Array.from(document.getElementById("team").selectedOptions).map(opt => opt.value);
        const teamMembers = [...new Set([currentUser.uid, ...selectedTeamUids])];

        try {
            await addDoc(collection(db, "projects"), {
                title,
                description,
                deadline,
                createdBy: currentUser.uid,
                teamMembers: teamMembers,
                progress: 0
            });

            alert("Project created successfully!");
            window.location.href = "project.html";
        } catch (error) {
            console.error("Error creating project: ", error);
            alert("Failed to create project. Please try again.");
        }
    });
});

async function loadUsers(selectElement) {
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach(doc => {
        const user = doc.data();
        selectElement.innerHTML += `<option value="${doc.id}">${user.fullName}</option>`;
    });
}
