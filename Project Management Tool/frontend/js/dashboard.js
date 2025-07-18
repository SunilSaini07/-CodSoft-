import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function () {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const welcomeEl = document.getElementById('welcome-message');
      if (welcomeEl) {
        if (!localStorage.getItem('dashboardVisited')) {
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            welcomeEl.textContent = `Welcome, ${userData.fullName}!`;
          } else {
            welcomeEl.textContent = "Welcome!";
          }
          localStorage.setItem('dashboardVisited', 'true');
        } else {
          welcomeEl.textContent = "Overview";
        }
      }
      displayDashboardData(user.uid);
    } else {
      window.location.href = "login.html";
    }
  });

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => window.location.href = "login.html");
    });
  }

  async function displayDashboardData(uid) {
    try {
      const projects = await getProjectsForUser(uid);
      renderProjectsOnDashboard(projects);

      const projectIds = projects.map(p => p.id);
      if (projectIds.length > 0) {
        const tasks = await getTasksForProjects(projectIds);
        initializeCalendar(tasks);
        renderTaskSummary(tasks);
      } else {
        initializeCalendar([]);
        renderTaskSummary([]);
      }
    } catch (error) {
      console.error("Error displaying dashboard data:", error);
    }
  }

  async function getProjectsForUser(uid) {
    const q = query(collection(db, "projects"), where("teamMembers", "array-contains", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  function renderProjectsOnDashboard(projects) {
    const container = document.getElementById('active-projects-list');
    if (!container) return;

    container.innerHTML = '';

    if (projects.length === 0) {
      container.innerHTML = '<p>No active projects. <a href="new-project.html">Create one to get started!</a></p>';
      return;
    }

    projects.slice(0, 2).forEach(project => {
      const projectEl = document.createElement('div');
      projectEl.className = 'project';
      const description = project.description || '';
      projectEl.innerHTML = `
        <div>
          <h3>${project.title}</h3>
          <p>${description.substring(0, 50)}${description.length > 50 ? '...' : ''}</p>
        </div>
        <a href="project.html"><button>View Projects</button></a>
      `;
      container.appendChild(projectEl);
    });
  }

  async function getTasksForProjects(projectIds) {
    const tasksQuery = query(collection(db, "tasks"), where("projectId", "in", projectIds));
    const querySnapshot = await getDocs(tasksQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  function initializeCalendar(tasks) {
    const calendarEl = document.getElementById("calendar");
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const todayBtn = document.getElementById('today-btn');
    const rangeEl = document.getElementById('calendar-range');

    if (!calendarEl) {
      console.error("Calendar container #calendar not found in the DOM.");
      return;
    }
    if (!prevBtn || !nextBtn || !todayBtn || !rangeEl) {
      console.error("Calendar navigation elements not found in the DOM.");
    }

    try {
      if (typeof tui === 'undefined' || typeof tui.Calendar === 'undefined') {
        throw new ReferenceError("ToastUI Calendar is not defined. The library may not have loaded correctly. Please check your network connection and the script tag in your HTML.");
      }

      const calendar = new tui.Calendar(calendarEl, {
        defaultView: 'month',
        useCreationPopup: false,
        useDetailPopup: true,
        calendars: [
          {
            id: 'tasks',
            name: 'Project Deadlines',
            backgroundColor: '#03a9f4',
            borderColor: '#03a9f4',
          },
        ],
      });

      const events = tasks
        .filter(task => task.title && task.dueDate)
        .map(task => ({
          id: task.id,
          calendarId: 'tasks',
          title: task.title,
          start: task.dueDate,
          end: task.dueDate,
          category: 'allday',
        }));

      calendar.createEvents(events);
      updateCalendarRange(calendar, rangeEl);

      // Wire up navigation controls
      prevBtn.addEventListener('click', () => {
        calendar.prev();
        updateCalendarRange(calendar, rangeEl);
      });

      nextBtn.addEventListener('click', () => {
        calendar.next();
        updateCalendarRange(calendar, rangeEl);
      });

      todayBtn.addEventListener('click', () => {
        calendar.today();
        updateCalendarRange(calendar, rangeEl);
      });

    } catch (error) {
      console.error("Failed to initialize Toast UI Calendar:", error);
      calendarEl.innerHTML = `<p style="color: red; padding: 10px;"><strong>Error:</strong> Could not load the calendar. <br><small>${error.message}</small></p>`;
    }
  }

  function updateCalendarRange(calendar, rangeEl) {
    if (!calendar || !rangeEl) return;
    const date = calendar.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    rangeEl.textContent = `${month} ${year}`;
  }

  function renderTaskSummary(tasks) {
    const totalTasks = tasks.length;
    const completionEl = document.getElementById('task-completion-percentage');
    const completedCountEl = document.getElementById('completed-tasks-count');
    const inProgressCountEl = document.getElementById('inprogress-tasks-count');
    const notStartedCountEl = document.getElementById('notstarted-tasks-count');

    if (totalTasks === 0) {
      completionEl.textContent = 'N/A';
      completedCountEl.textContent = 'Completed (0)';
      inProgressCountEl.textContent = 'In Progress (0)';
      notStartedCountEl.textContent = 'Not Started (0)';
      return;
    }

    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const notStartedTasks = totalTasks - completedTasks - inProgressTasks;

    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    completionEl.textContent = `${completionPercentage}%`;
    completedCountEl.textContent = `Completed (${completedTasks})`;
    inProgressCountEl.textContent = `In Progress (${inProgressTasks})`;
    notStartedCountEl.textContent = `Not Started (${notStartedTasks})`;
  }
});
