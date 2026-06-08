// Dashboard page behaviour. Externalised (no inline script/handlers) so the app
// can run under a strict Content-Security-Policy (script-src 'self').

function toggleProfileMenu() {
  document.getElementById("profileMenu").classList.toggle("visible");
}

function toggleNotifications() {
  document.getElementById("sidePanel").classList.toggle("visible");
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/login";
}

function openReport(id) {
  document.title = "Report " + id + " - Demo App";
}

// Render reports dynamically from database
async function loadAndRenderReports() {
  const token = localStorage.getItem("authToken");
  const grid = document.getElementById("tilesGrid");
  if (!grid) return;

  try {
    const response = await fetch("/api/v1/reports", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }

    const json = await response.json();
    const reports = json.data;

    // Clear grid
    grid.innerHTML = "";

    reports.forEach((report) => {
      const tile = document.createElement("div");
      tile.className = "report-tile";
      tile.setAttribute("data-testid", "report-tile");
      tile.setAttribute("data-report-id", report.id);

      // Map icons based on report id or name
      let icon = "$";
      let iconClass = "ico-sales";
      let metric = "$48.2K";
      let percentage = "▲ 12.5%";
      let badgeClass = "badge-up";

      if (report.name.toLowerCase().includes("marketing")) {
        icon = "%";
        iconClass = "ico-mkt";
        metric = "18.4K";
        percentage = "▲ 6.1%";
      } else if (report.name.toLowerCase().includes("finance")) {
        icon = "∑";
        iconClass = "ico-fin";
        metric = "$112K";
        percentage = "▼ 2.3%";
        badgeClass = "badge-down";
      } else if (report.id !== "1" && report.id !== "2" && report.id !== "3") {
        icon = "+";
        iconClass = "ico-sales";
        metric = "0.00";
        percentage = "New";
        badgeClass = "badge-muted";
      }

      tile.innerHTML = `
        <div class="tile-top">
          <span class="tile-ico ${iconClass}" aria-hidden="true">${icon}</span>
          <span class="badge ${badgeClass}">${percentage}</span>
        </div>
        <p class="tile-metric">${metric}</p>
        <h3>${report.name}</h3>
        <p class="tile-sub">Last updated: ${new Date(report.createdAt).toLocaleDateString()}</p>
        <div class="spark" aria-hidden="true" style="display: flex; gap: 4px; margin-top: 10px; height: 30px;">
          <span style="flex: 1; background: #818cf8; border-radius: 2px; height: 40%"></span>
          <span style="flex: 1; background: #818cf8; border-radius: 2px; height: 60%"></span>
          <span style="flex: 1; background: #818cf8; border-radius: 2px; height: 50%"></span>
          <span style="flex: 1; background: #818cf8; border-radius: 2px; height: 80%"></span>
        </div>
        <button class="delete-report-btn" data-testid="delete-report-btn" style="margin-top: 12px; padding: 4px 8px; font-size: 11px; background: rgba(239,68,68,0.14); color: #f87171; border: 1px solid rgba(239,68,68,0.32); border-radius: 4px; cursor: pointer; font-weight: 600; width: 100%;">Delete</button>
      `;

      // Event Listeners
      tile.addEventListener("click", (e) => {
        // Prevent click if clicking the delete button
        if (e.target.classList.contains("delete-report-btn")) return;
        openReport(report.id);
      });

      const deleteBtn = tile.querySelector(".delete-report-btn");
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await deleteReport(report.id);
      });

      grid.appendChild(tile);
    });

  } catch (error) {
    console.error("Error loading reports:", error);
  }
}

async function createNewReport() {
  const name = prompt("Enter the name of your new report:");
  if (!name) return;

  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("/api/v1/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: name, status: "active" })
    });

    if (response.ok) {
      await loadAndRenderReports();
    } else {
      alert("Failed to create report. Check Authorization token.");
    }
  } catch (err) {
    console.error("Error creating report:", err);
  }
}

async function deleteReport(id) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`/api/v1/reports/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      await loadAndRenderReports();
    } else {
      alert("Failed to delete report.");
    }
  } catch (err) {
    console.error("Error deleting report:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Guard
  if (localStorage.getItem("authToken") !== "mock-jwt-token-12345") {
    window.location.replace("/login");
    return;
  }

  // Bind core UI triggers
  document
    .querySelector('[data-testid="notification-bell"]')
    .addEventListener("click", toggleNotifications);
  document
    .querySelector('[data-testid="user-profile"]')
    .addEventListener("click", toggleProfileMenu);
  document
    .querySelector('[data-testid="logout-button"]')
    .addEventListener("click", logout);
  document
    .querySelector('[data-testid="create-new-btn"]')
    .addEventListener("click", createNewReport);

  // Search filtering
  document
    .getElementById("searchInput")
    .addEventListener("keyup", function () {
      const query = this.value.toLowerCase();
      const tiles = document.querySelectorAll('[data-testid="report-tile"]');
      tiles.forEach((tile) => {
        const name = tile.querySelector("h3").textContent.toLowerCase();
        tile.style.display = name.includes(query) ? "block" : "none";
      });
    });

  // Load and render reports dynamically
  loadAndRenderReports();
});
