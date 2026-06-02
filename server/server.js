const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const employerRoutes = require("./routes/employerRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://jobboard-app.vercel.app"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Job Board API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});