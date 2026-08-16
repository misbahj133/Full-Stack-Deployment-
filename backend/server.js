require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

// Security headers
app.use(helmet());

// Gzip/Brotli compression - reduces payload size, helps Lighthouse "text compression" audit
app.use(compression());

// CORS - restrict to the deployed frontend origin(s)
// CORS - restrict to the deployed frontend origin(s)
const allowedOrigins = [
  "http://localhost:5173",
  "https://railway.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin matches allowed list or matches your main subdomains
      if (allowedOrigins.includes(origin) || origin.includes("noble-enchantment-production-c3cb.up.railway.app")) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Basic rate limiting to protect auth endpoints from brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many attempts, please try again later" },
});
app.use("/api/auth", authLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
