const Employer = require("../models/Employer");

// Create or Update Company Profile
const upsertCompanyProfile = async (req, res) => {
  try {
    const { companyName, companyDescription, website, location } = req.body;

    let profile = await Employer.findOne({ userId: req.user.id });

    if (profile) {
      profile.companyName = companyName || profile.companyName;
      profile.companyDescription = companyDescription || profile.companyDescription;
      profile.website = website || profile.website;
      profile.location = location || profile.location;
      await profile.save();
    } else {
      profile = await Employer.create({
        userId: req.user.id,
        companyName,
        companyDescription,
        website,
        location,
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Company Profile
const getCompanyProfile = async (req, res) => {
  try {
    const profile = await Employer.findOne({ userId: req.user.id }).populate("userId", "-password");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Employer Dashboard Stats
const getEmployerStats = async (req, res) => {
  try {
    const Job = require("../models/Job");
    const Application = require("../models/Application");

    const jobs = await Job.find({ employerId: req.user.id });
    const jobIds = jobs.map((j) => j._id);

    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: "Shortlisted" });
    const rejected = await Application.countDocuments({ jobId: { $in: jobIds }, status: "Rejected" });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs: jobs.length,
        totalApplications,
        shortlisted,
        rejected,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { upsertCompanyProfile, getCompanyProfile, getEmployerStats };