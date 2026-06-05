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
  // Mock client-side route guard. This demo stores its session token in
  // localStorage, so an unauthenticated visitor (missing or unrecognised token)
  // is bounced to the login page. This is test-realistic behaviour, NOT real
  // security: the server still returns the HTML, so a real app must also enforce
  // auth server-side.
  if (localStorage.getItem("authToken") !== "mock-jwt-token-12345") {
    window.location.replace("/login");
    return;
  }

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
