require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const pemasukanRoutes = require("./routes/pemasukanRoutes");
const pengeluaranRoutes = require("./routes/pengeluaranRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const userRoutes = require("./routes/userRoutes");

require("./config/postgres");

const app = express();

// ============================================================
// CORS CONFIGURATION
// ============================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://luminous-semolina-3858f6.netlify.app",
];

// ============================================================
// CORS
// ============================================================

const corsOptions = {
  origin: function (origin, callback) {
    // Request tanpa Origin:
    // PowerShell, Postman, server-to-server, dll.
    if (!origin) {
      return callback(null, true);
    }

    // Origin diizinkan
    if (allowedOrigins.includes(origin)) {
      console.log("CORS ALLOWED:", origin);
      return callback(null, true);
    }

    console.log("CORS BLOCKED:", origin);

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
};

// Pasang CORS
app.use(cors(corsOptions));

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
// TEST BACKEND
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
    message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`,
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

  // Error CORS
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

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
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
// EXPORT APP FOR VERCEL
// ============================================================

module.exports = app;