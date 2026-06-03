// Login page behaviour. Externalised (no inline script/handlers) so the app can
// run under a strict Content-Security-Policy (script-src 'self').

function toggleButton() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  document.getElementById("loginBtn").disabled = !(email && password);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("errorMsg");
  const spinner = document.getElementById("spinner");

  errorEl.classList.remove("visible");
  spinner.classList.add("visible");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    spinner.classList.remove("visible");

    if (data.success) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "/dashboard";
    } else {
      errorEl.textContent = data.message;
      errorEl.classList.add("visible");
    }
  } catch (err) {
    spinner.classList.remove("visible");
    errorEl.textContent = "Network error. Please try again.";
    errorEl.classList.add("visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("email").addEventListener("input", toggleButton);
  document.getElementById("password").addEventListener("input", toggleButton);
});
