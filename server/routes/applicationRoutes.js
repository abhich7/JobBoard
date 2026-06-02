const express = require("express");

const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect =
  require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/apply/:jobId",
  protect,
  applyJob
);

router.get(
  "/my-applications",
  protect,
  getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  getJobApplicants
);

router.put(
  "/status/:applicationId",
  protect,
  updateApplicationStatus
);

module.exports = router;