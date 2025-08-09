const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS setup — allows frontend to call backend
app.use(
  cors({
    origin: "*", // For production, replace with actual frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Include Authorization for JWT
  })
);

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB error:", err));

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Task Manager API is running");
});

// ✅ API routes
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

app.use("/api/tasks", taskRoutes); // Protected routes
app.use("/api/auth", authRoutes);  // Public auth routes

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
