import { db, auth } from "./firebase-config.js";
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const teamGrid = document.getElementById('team-grid');
  const searchInput = document.getElementById('searchInput');
  let allTeamMembers = []; 

  if (!teamGrid || !searchInput) {
    console.error("Required elements (team-grid or searchInput) not found.");
    return;
  }

  // Function to render team members to the grid
  function renderTeam(members) {
    teamGrid.innerHTML = '';
    if (members.length === 0) {
      teamGrid.innerHTML = '<p>No team members found.</p>';
      return;
    }
    members.forEach(member => {
      const card = document.createElement('div');
      card.classList.add('card');
      // Using a placeholder image as it's not in the DB
      card.innerHTML = `
        <img src="https://placehold.co/100x100" alt="${member.name}" />
        <h4>${member.name}</h4>
        <p>${member.email}</p>
      `;
      teamGrid.appendChild(card);
    });
  }

  // Search functionality
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allTeamMembers.filter(member =>
      member.name.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword)
    );
    renderTeam(filtered);
  });

  // Fetch data on auth state change
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const projectsQuery = query(collection(db, "projects"), where("teamMembers", "array-contains", user.uid));
        const projectsSnapshot = await getDocs(projectsQuery);

        const teamMemberUids = new Set();
        projectsSnapshot.forEach(projectDoc => {
          const team = projectDoc.data().teamMembers || [];
          team.forEach(uid => teamMemberUids.add(uid));
        });
        
        const teamMemberPromises = Array.from(teamMemberUids).map(uid => getDoc(doc(db, "users", uid)));
        const teamMemberDocs = await Promise.all(teamMemberPromises);

        allTeamMembers = teamMemberDocs
          .filter(doc => doc.exists())
          .map(doc => ({
            id: doc.id,
            name: doc.data().fullName,
            email: doc.data().email,
          }));
        
        renderTeam(allTeamMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
        teamGrid.innerHTML = '<p>Error loading team members. Please try again later.</p>';
      }
    } else {
      window.location.href = "login.html";
    }
  });
});
