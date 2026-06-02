const express = require("express");
const {
  upsertCompanyProfile,
  getCompanyProfile,
  getEmployerStats,
} = require("../controllers/employerController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", protect, getCompanyProfile);
router.put("/profile", protect, upsertCompanyProfile);
router.get("/stats", protect, getEmployerStats);

module.exports = router;