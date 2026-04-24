require("dotenv").config();

const express = require("express");
const cors = require("cors");
const compression = require("compression");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://dsalksj.in",
  "https://www.dsalksj.in"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
  })
);

app.use(
  compression({
    level: 6,
    threshold: 1024
  })
);

app.use(express.json({ limit: "2mb" }));

app.use((req, res, next) => {
  res.setHeader("X-DNS-Prefetch-Control", "on");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("dsalksj Gaming Platform 🎮 Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend healthy"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});