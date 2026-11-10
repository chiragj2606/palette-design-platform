require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const designRoutes = require("./src/routes/designRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const saveRoutes = require("./src/routes/saveRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const learnRoutes = require("./src/routes/learnRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Design Platform Backend is running!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", protectedRoutes);
app.use("/api/designs", saveRoutes);
app.use("/api/designs", likeRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/designs", commentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/learn", learnRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});