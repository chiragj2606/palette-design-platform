
const Application = require("../models/application");
const Job = require("../models/job");

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { coverLetter, portfolioLink } = req.body;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job || job.status !== "Open") {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer accepting applications.",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      coverLetter,
      portfolioLink,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get applications submitted by the logged-in user
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.userId,
    })
      .populate("job")
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

module.exports = {
  applyForJob,
  getMyApplications,
};
