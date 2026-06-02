const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const {
  sendApplicationEmail,
  sendStatusUpdateEmail,
} = require("../services/emailService");

// Apply For Job
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      jobId: req.params.jobId,
      applicantId: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    const application = await Application.create({
      jobId: req.params.jobId,
      applicantId: req.user.id,
    });

    // Send application email (non-blocking)
    const userData = await User.findById(req.user.id);
    sendApplicationEmail(
      userData.email,
      userData.name,
      job.title
    ).catch(console.error);

    res.status(201).json({
      success: true,
      message: "Application submitted",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// My Applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user.id,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Applicants For A Job
const getJobApplicants = async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    }).populate("applicantId", "-password");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Status
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.applicationId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = req.body.status;
    await application.save();

    // Send status update email (non-blocking)
    const appData = await Application.findById(req.params.applicationId)
      .populate("applicantId")
      .populate("jobId");

    sendStatusUpdateEmail(
      appData.applicantId.email,
      appData.applicantId.name,
      appData.jobId.title,
      req.body.status
    ).catch(console.error);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};