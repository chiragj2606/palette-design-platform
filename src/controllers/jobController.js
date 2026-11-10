
const Job = require("../models/job");

// Get all open jobs, with optional search and filters
const getJobs = async (req, res) => {
  try {
    const { search, employmentType, experienceLevel, workMode } = req.query;

    const filter = { status: "Open" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    if (employmentType) filter.employmentType = employmentType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (workMode) filter.workMode = workMode;

    const jobs = await Job.find(filter)
      .populate("postedBy", "name username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name username");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
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

// Create a job
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      employmentType,
      experienceLevel,
      description,
      requirements,
      skills,
      salary,
      workMode,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      employmentType,
      experienceLevel,
      description,
      requirements,
      skills,
      salary,
      workMode,
      postedBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get jobs posted by the logged-in employer
const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.userId,
    })
      .populate("postedBy", "name username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
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
  getJobs,
  getJobById,
  createJob,
  getMyPostedJobs,
};
