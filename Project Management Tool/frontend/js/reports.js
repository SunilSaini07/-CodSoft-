
const completionChart = new Chart(document.getElementById("completionChart"), {
  type: "bar",
  data: {
    labels: ["Team A", "Team B", "Team C"],
    datasets: [{
      label: "Completion",
      data: [80, 70, 75],
      backgroundColor: "#cbd5e1"
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } }
  }
});

// Workload Distribution Chart
const workloadChart = new Chart(document.getElementById("workloadChart"), {
  type: "horizontalBar", 
  data: {
    labels: ["Team A", "Team B", "Team C"],
    datasets: [{
      label: "Tasks",
      data: [20, 15, 25],
      backgroundColor: "#e2e8f0"
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } }
  }
});

// Time Tracking Trends
const timeChart = new Chart(document.getElementById("timeChart"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Hours",
      data: [40, 30, 45, 35, 50, 42],
      fill: false,
      borderColor: "#3b82f6",
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});
