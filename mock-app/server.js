const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.MOCK_PORT || 3000;

const VALID_USERS = {
  "testuser@example.com": "SecurePassword123!",
  "admin@example.com": "AdminPassword123!",
};

// Dynamic database state for reports to support full end-to-end CRUD UI tests!
let REPORTS = [
  { id: "1", name: "Sales Report", createdAt: "2026-01-15T10:00:00Z", status: "active" },
  { id: "2", name: "Marketing Dashboard", createdAt: "2026-02-20T14:30:00Z", status: "active" },
  { id: "3", name: "Finance Overview", createdAt: "2026-03-10T09:15:00Z", status: "draft" },
];

// Chaos Engineering Config - Allows programmatically injecting errors/slowness to test resilience
let chaosConfig = {
  delayMs: 0,
  errorStatus: 0,
};

function serveFile(res, filePath, contentType) {
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

  // --- Chaos Injection Interception (Dynamic Failures & Latency) ---
  if (chaosConfig.delayMs > 0 && pathname !== "/api/v1/chaos") {
    await new Promise((resolve) => setTimeout(resolve, chaosConfig.delayMs));
  }
  if (chaosConfig.errorStatus > 0 && pathname.startsWith("/api/") && pathname !== "/api/v1/chaos") {
    const status = chaosConfig.errorStatus;
    return jsonResponse(res, status, {
      error: "ChaosException",
      message: `Simulated ${status} Internal Server Error from Chaos Engine.`,
    });
  }

  // --- Security headers (applied to every response) ---
  const allowedOrigin = process.env.ALLOWED_ORIGIN || `http://localhost:${PORT}`;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
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

  // --- Routing ---

  if (pathname === "/" || pathname === "/login") {
    return serveFile(res, "pages/login.html", "text/html; charset=utf-8");
  }
  if (pathname === "/dashboard") {
    return serveFile(res, "pages/dashboard.html", "text/html; charset=utf-8");
  }

  // Static JS assets.
  if (pathname.startsWith("/public/") && pathname.endsWith(".js")) {
    const safeName = path.basename(pathname);
    return serveFile(
      res,
      path.join("public", safeName),
      "application/javascript; charset=utf-8"
    );
  }

  // API Health Check
  if (pathname === "/api/v1/health") {
    return jsonResponse(res, 200, { status: "healthy", timestamp: new Date().toISOString() });
  }

  // API Chaos Control Panel - Endpoint for QA Automation to inject dynamic failure scenarios
  if (pathname === "/api/v1/chaos" && req.method === "POST") {
    const { valid, data } = await parseBody(req);
    if (!valid) {
      return jsonResponse(res, 400, { success: false, message: "Invalid JSON body" });
    }
    
    if (data.reset) {
      chaosConfig = { delayMs: 0, errorStatus: 0 };
    } else {
      if (typeof data.delayMs === "number") chaosConfig.delayMs = data.delayMs;
      if (typeof data.errorStatus === "number") chaosConfig.errorStatus = data.errorStatus;
    }
    return jsonResponse(res, 200, { success: true, activeChaos: chaosConfig });
  }

  // API Reports (CRUD capable)
  if (pathname === "/api/v1/reports") {
    const authHeader = req.headers.authorization || "";
    const expectedToken = `Bearer ${process.env.API_TOKEN || "mock-jwt-token-12345"}`;
    if (authHeader !== expectedToken) {
      return jsonResponse(res, 401, { error: "Unauthorized", message: "Invalid or missing token" });
    }

    if (req.method === "GET") {
      return jsonResponse(res, 200, { data: REPORTS, total: REPORTS.length });
    }

    if (req.method === "POST") {
      const { valid, data } = await parseBody(req);
      if (!valid || !data.name) {
        return jsonResponse(res, 400, { error: "Bad Request", message: "Report name is required." });
      }
      const newReport = {
        id: String(REPORTS.length + 1),
        name: data.name,
        createdAt: new Date().toISOString(),
        status: data.status || "active"
      };
      REPORTS.push(newReport);
      return jsonResponse(res, 201, { success: true, data: newReport });
    }
  }

  // API Report deletion support
  if (pathname.startsWith("/api/v1/reports/") && req.method === "DELETE") {
    const authHeader = req.headers.authorization || "";
    const expectedToken = `Bearer ${process.env.API_TOKEN || "mock-jwt-token-12345"}`;
    if (authHeader !== expectedToken) {
      return jsonResponse(res, 401, { error: "Unauthorized", message: "Invalid or missing token" });
    }

    const reportId = pathname.split("/").pop();
    const index = REPORTS.findIndex(r => r.id === reportId);
    if (index === -1) {
      return jsonResponse(res, 404, { error: "Not Found", message: `Report ID ${reportId} not found.` });
    }
    REPORTS.splice(index, 1);
    return jsonResponse(res, 200, { success: true, deletedId: reportId });
  }

  // API Authentication
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
