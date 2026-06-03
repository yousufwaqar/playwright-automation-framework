const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.MOCK_PORT || 3000;

const VALID_USERS = {
  "testuser@example.com": "SecurePassword123!",
  "admin@example.com": "AdminPassword123!",
};

const REPORTS = [
  { id: "1", name: "Sales Report", createdAt: "2026-01-15T10:00:00Z", status: "active" },
  { id: "2", name: "Marketing Dashboard", createdAt: "2026-02-20T14:30:00Z", status: "active" },
  { id: "3", name: "Finance Overview", createdAt: "2026-03-10T09:15:00Z", status: "draft" },
];

function serveFile(res, filePath, contentType) {
  const fullPath = path.join(__dirname, filePath);
  const content = fs.readFileSync(fullPath, "utf-8");
  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
}

function serveStatic(res, filePath, contentType) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const content = fs.readFileSync(fullPath, "utf-8");
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch {
    jsonResponse(res, 404, { error: "Not Found" });
  }
}

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (body === "") return resolve({ valid: true, data: {} });
      try {
        resolve({ valid: true, data: JSON.parse(body) });
      } catch {
        resolve({ valid: false, data: {} });
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // --- Security headers (applied to every response) ---
  // NOTE: HSTS is intentionally omitted — this mock app is served over plain
  // HTTP on localhost, where Strict-Transport-Security is not meaningful.
  const allowedOrigin = process.env.ALLOWED_ORIGIN || `http://localhost:${PORT}`;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join("; ")
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (pathname === "/" || pathname === "/login") {
    return serveFile(res, "pages/login.html", "text/html; charset=utf-8");
  }
  if (pathname === "/dashboard") {
    return serveFile(res, "pages/dashboard.html", "text/html; charset=utf-8");
  }

  // Static JS assets. path.basename strips any directory component to prevent
  // path-traversal (e.g. /public/../../etc/passwd).
  if (pathname.startsWith("/public/") && pathname.endsWith(".js")) {
    const safeName = path.basename(pathname);
    return serveStatic(
      res,
      path.join("public", safeName),
      "application/javascript; charset=utf-8"
    );
  }

  if (pathname === "/api/v1/health") {
    return jsonResponse(res, 200, { status: "healthy", timestamp: new Date().toISOString() });
  }

  if (pathname === "/api/v1/reports") {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ") || authHeader === "Bearer invalid-token") {
      return jsonResponse(res, 401, { error: "Unauthorized", message: "Invalid or missing token" });
    }
    return jsonResponse(res, 200, { data: REPORTS, total: REPORTS.length });
  }

  if (pathname === "/api/login" && req.method === "POST") {
    const { valid, data } = await parseBody(req);
    if (!valid) {
      return jsonResponse(res, 400, {
        success: false,
        message: "Invalid request body",
      });
    }
    const { email, password } = data;
    if (VALID_USERS[email] && VALID_USERS[email] === password) {
      return jsonResponse(res, 200, { success: true, token: "mock-jwt-token-12345" });
    }
    return jsonResponse(res, 401, { success: false, message: "Invalid email or password. Please try again." });
  }

  jsonResponse(res, 404, { error: "Not Found" });
});

server.listen(PORT, () => {
  console.log(`Mock app server running on http://localhost:${PORT}`);
});
