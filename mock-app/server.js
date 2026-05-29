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

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (pathname === "/" || pathname === "/login") {
    return serveFile(res, "pages/login.html", "text/html");
  }
  if (pathname === "/dashboard") {
    return serveFile(res, "pages/dashboard.html", "text/html");
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
    const body = await parseBody(req);
    const { email, password } = body;
    if (VALID_USERS[email] && VALID_USERS[email] === password) {
      return jsonResponse(res, 200, { success: true, token: "mock-jwt-token-12345" });
    }
    return jsonResponse(res, 401, {
      success: false,
      message: "Invalid email or password. Please try again.",
    });
  }

  jsonResponse(res, 404, { error: "Not Found" });
});

server.listen(PORT, () => {
  console.log(`Mock app server running on http://localhost:${PORT}`);
});
