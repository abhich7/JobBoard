const express = require("express");

const {
  getProfile,
  updateProfile,
  uploadResume,
} = require("../controllers/userController");

const protect =
  require("../middleware/authMiddleware");

const upload =
  require("../config/multer");

const router = express.Router();

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;