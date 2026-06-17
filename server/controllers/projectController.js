const Project = require("../models/Project");
const Feedback = require("../models/Feedback");

const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const projectKey = "INS_" + Math.random().toString(36).substring(2, 10);

    const project = await Project.create({
      name,
      projectKey,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Feedback.deleteMany({ project: projectId });
    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};