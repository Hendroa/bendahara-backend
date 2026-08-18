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

require("./config/db");

const app = express();

// ========================================
// CORS
// ========================================
//
// Development:
// http://localhost:5173
// http://localhost:3000
//
// Production:
// FRONTEND_URL=https://nama-aplikasi.netlify.app
//

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {

            // Izinkan request tanpa origin
            // Contoh: Postman, PowerShell, server-to-server
            if (!origin) {
                return callback(null, true);
            }

            // Izinkan origin yang terdaftar
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("CORS BLOCKED:", origin);

            return callback(
                new Error("Origin tidak diizinkan oleh CORS")
            );
        },

        credentials: true
    })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ========================================
// TEST BACKEND
// ========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        status: "OK",
        message: "Backend Bendahara Berjalan"
    });
});

// ========================================
// HEALTH CHECK
// ========================================

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        message: "Backend Bendahara Online",
        timestamp: new Date().toISOString()
    });
});

// ========================================
// AUTH ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);

// ========================================
// PEMASUKAN ROUTES
// ========================================

app.use(
    "/api/pemasukan",
    pemasukanRoutes
);

// ========================================
// PENGELUARAN ROUTES
// ========================================

app.use(
    "/api/pengeluaran",
    pengeluaranRoutes
);

// ========================================
// APPROVAL ROUTES
// ========================================

app.use(
    "/api/approval",
    approvalRoutes
);

// ========================================
// DASHBOARD ROUTES
// ========================================

app.use(
    "/api/dashboard",
    dashboardRoutes
);

// ========================================
// LAPORAN ROUTES
// ========================================

app.use(
    "/api/laporan",
    laporanRoutes
);

// ========================================
// USERS ROUTES
// ========================================

app.use(
    "/api/users",
    userRoutes
);

// ========================================
// 404
// ========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`
    });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error("SERVER ERROR:", err);

    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server"
    });
});

// ========================================
// PORT
// ========================================
//
// Production:
// Hosting akan memberikan PORT.
//
// Development:
// Jika PORT tidak tersedia,
// gunakan port 5000.
//

const PORT = process.env.PORT || 5000;

// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log("=======================================");
        console.log("       BACKEND BENDAHARA");
        console.log("=======================================");
        console.log(`Server berjalan pada PORT ${PORT}`);
        console.log("Health Check: /health");
        console.log("=======================================");
        console.log("");
    }
);