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

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector('[data-testid="notification-bell"]')
    .addEventListener("click", toggleNotifications);
  document
    .querySelector('[data-testid="user-profile"]')
    .addEventListener("click", toggleProfileMenu);
  document
    .querySelector('[data-testid="logout-button"]')
    .addEventListener("click", logout);

  document.querySelectorAll('[data-testid="report-tile"]').forEach((tile) => {
    const reportId = tile.getAttribute("data-report-id") || "1";
    tile.addEventListener("click", () => openReport(reportId));
  });

  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const query = this.value.toLowerCase();
        const tiles = document.querySelectorAll('[data-testid="report-tile"]');
        tiles.forEach((tile) => {
          const name = tile.querySelector("h3").textContent.toLowerCase();
          tile.style.display = name.includes(query) ? "block" : "none";
        });
      }
    });
});
