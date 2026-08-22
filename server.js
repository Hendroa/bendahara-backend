require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ============================================================
// ROUTES
// ============================================================

const authRoutes = require("./routes/authRoutes");
const pemasukanRoutes = require("./routes/pemasukanRoutes");
const pengeluaranRoutes = require("./routes/pengeluaranRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const userRoutes = require("./routes/userRoutes");

require("./config/postgres");

// ============================================================
// APP
// ============================================================

const app = express();

// ============================================================
// ALLOWED ORIGINS
// ============================================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:3000",

  // Frontend Vercel production utama
  "https://bendahara-frontend.vercel.app",

  // Frontend Vercel deployment yang sedang digunakan
  "https://bendahara-frontend-zk45-fc041oyax-hendro1.vercel.app",

  // Frontend Netlify lama
  "https://luminous-semolina-3858f6.netlify.app",

  // Environment variable
  process.env.FRONTEND_URL,
].filter(Boolean);

// ============================================================
// CORS CHECK
// ============================================================

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(origin);
}

// ============================================================
// DEBUG ALLOWED ORIGINS
// ============================================================

console.log("=======================================");
console.log("CORS ALLOWED ORIGINS");
console.log("=======================================");

allowedOrigins.forEach((origin) => {
  console.log("-", origin);
});

console.log("=======================================");

// ============================================================
// CORS MIDDLEWARE
// ============================================================

app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log("=======================================");
  console.log("CORS REQUEST");
  console.log("METHOD:", req.method);
  console.log("ORIGIN:", origin || "-");
  console.log("URL:", req.originalUrl);
  console.log("=======================================");

  // ----------------------------------------------------------
  // REQUEST TANPA ORIGIN
  // ----------------------------------------------------------

  if (!origin) {
    return next();
  }

  // ----------------------------------------------------------
  // ORIGIN DIIZINKAN
  // ----------------------------------------------------------

  if (isAllowedOrigin(origin)) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin
    );

    res.setHeader(
      "Access-Control-Allow-Credentials",
      "true"
    );

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept"
    );

    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Type"
    );

    console.log(
      "CORS ALLOWED:",
      origin
    );
  } else {
    console.log(
      "CORS BLOCKED:",
      origin
    );
  }

  // ----------------------------------------------------------
  // PREFLIGHT OPTIONS
  // ----------------------------------------------------------

  if (req.method === "OPTIONS") {
    if (isAllowedOrigin(origin)) {
      return res.status(204).end();
    }

    return res.status(403).json({
      success: false,
      message:
        "Origin tidak diizinkan oleh CORS",
    });
  }

  next();
});

// ============================================================
// EXPRESS CORS
// ============================================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Request tanpa Origin
      if (!origin) {
        return callback(null, true);
      }

      // Origin diizinkan
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      // Origin ditolak
      return callback(
        new Error(
          `Origin tidak diizinkan oleh CORS: ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],

    exposedHeaders: [
      "Content-Type",
    ],

    optionsSuccessStatus: 204,
  })
);

// ============================================================
// BODY PARSER
// ============================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ============================================================
// REQUEST LOGGER
// ============================================================

app.use((req, res, next) => {
  console.log(
    `[REQUEST] ${req.method} ${req.originalUrl}`
  );

  console.log(
    "[ORIGIN]",
    req.headers.origin || "-"
  );

  next();
});

// ============================================================
// ROOT
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "Backend Bendahara Berjalan",
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    message: "Backend Bendahara Online",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// API ROUTES
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/pemasukan",
  pemasukanRoutes
);

app.use(
  "/api/pengeluaran",
  pengeluaranRoutes
);

app.use(
  "/api/approval",
  approvalRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/laporan",
  laporanRoutes
);

app.use(
  "/api/users",
  userRoutes
);

// ============================================================
// 404
// ============================================================

app.use((req, res) => {
  console.log(
    `[404] ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message:
      `Route tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
  console.error(
    "======================================="
  );

  console.error(
    "SERVER ERROR:"
  );

  console.error(err);

  console.error(
    "======================================="

  );

  // ----------------------------------------------------------
  // CORS ERROR
  // ----------------------------------------------------------

  if (
    err &&
    typeof err.message === "string" &&
    err.message.includes(
      "Origin tidak diizinkan oleh CORS"
    )
  ) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // ----------------------------------------------------------
  // GENERAL ERROR
  // ----------------------------------------------------------

  return res.status(500).json({
    success: false,
    message:
      "Terjadi kesalahan pada server",
  });
});

// ============================================================
// LOCAL SERVER
// ============================================================

if (require.main === module) {
  const PORT =
    process.env.PORT || 5000;

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log("");
      console.log(
        "======================================="
      );
      console.log(
        "       BACKEND BENDAHARA"
      );
      console.log(
        "======================================="
      );
      console.log(
        `Server berjalan pada PORT ${PORT}`
      );
      console.log(
        "Health Check: /health"
      );
      console.log(
        "======================================="
      );
      console.log("");
    }
  );
}

// ============================================================
// VERCEL
// ============================================================

module.exports = app;