const Job = require("../models/Job");

// Create Job
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      location,
      category,
      experience,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      salary,
      location,
      category,
      experience,
      employerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Jobs (Search + Filter + Pagination)
const getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      category,
      experience,
      minSalary,
      maxSalary,
      page,
      limit,
      sortBy,
    } = req.query;

    const query = {};

    // Search by keyword in title or description
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Filter by experience
    if (experience) {
      query.experience = { $regex: experience, $options: "i" };
    }

    // Filter by salary range
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    // Pagination
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sortBy === "salary_asc") sortOption = { salary: 1 };
    if (sortBy === "salary_desc") sortOption = { salary: -1 };
    if (sortBy === "oldest") sortOption = { createdAt: 1 };

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("employerId", "-password")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize),
      currentPage: pageNumber,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Job By ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "-password"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Jobs (Employer)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};