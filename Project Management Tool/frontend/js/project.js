import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadProjectsForUser(user.uid);
    } else {
      window.location.href = "login.html";
    }
  });
});

async function loadProjectsForUser(uid) {
  const tableBody = document.getElementById("project-list");
  if (!tableBody) return;

  try {
    const projectsQuery = query(collection(db, "projects"), where("teamMembers", "array-contains", uid));
    const querySnapshot = await getDocs(projectsQuery);

    if (querySnapshot.empty) {
      tableBody.innerHTML = '<tr><td colspan="4">No projects found. Create one to get started!</td></tr>';
      return;
    }

    tableBody.innerHTML = ''; // Clear loading/empty state
    querySnapshot.forEach(doc => {
      const project = doc.data();
      const row = createProjectRow(project);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading projects: ", error);
    tableBody.innerHTML = '<tr><td colspan="4">Error loading projects. Please try again.</td></tr>';
  }
}

function createProjectRow(project) {
  const row = document.createElement("tr");

  // Project Name
  row.innerHTML += `<td>${project.title || 'N/A'}</td>`;

  // Progress Bar
  const progress = project.progress || 0;
  row.innerHTML += `
    <td>
      <div style="display: flex; align-items: center;">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>
        <span class="progress-text">${progress}%</span>
      </div>
    </td>
  `;

  // Deadline
  row.innerHTML += `<td style="color: #60a5fa;">${project.deadline || 'N/A'}</td>`;

  // Team Members
  const teamAvatarsHtml = (project.teamMembers || [])
    .map(() => `<img src="https://placehold.co/32x32" alt="Team member avatar">`)
    .join('');
  row.innerHTML += `
    <td>
      <div class="team-avatars">${teamAvatarsHtml}</div>
    </td>
  `;

  return row;
}
