import express from 'express';
import mongoose from 'mongoose';

import Project from '../models/projects';
import Customer from '../models/customers';
import HttpError from '../models/http-error';
import checkAuth from '../middleware/check-auth';

export const router = express.Router();

router.use(checkAuth);

// get project
router.get("/:pid", async (req: any, res: any, next: any) => {
  const reqId = await req.params.pid;
  let project;
  try {
    project = await Project.findById(reqId);
  } catch (err) {
    const error = new HttpError("Looking for project failed!", 500);
    return next(error);
  }

  if (!project) {
    const error = new HttpError("Could not find an project", 404);
    return next(error);
  }

  // if (project.toObject().owner.toString() !== req.userData.customerId) {
  //   const error = new HttpError("Not allowed to see this place", 401);
  //   return next(error);
  // }

  res.json({ project: project.toObject({ getters: true }) });
});

// get projects by customer id
router.get("/customer/:cid", async (req: any, res: any, next: any) => {
  const customerId = req.params.cid;

  let projects;
  try {
    projects = await Project.find({ owner: customerId });
  } catch (err) {
    const error = new HttpError("Could not find customer", 500);
    return next(error);
  }

  if (!projects || projects.length === 0) {
    return next(
      new HttpError("Could not find projects for the provided customer id", 404)
    );
  }

  // if (projects[0].toObject().owner.toString() !== req.userData.customerId) {
  //   const error = new HttpError("Not allowed to see this places", 401);
  //   return next(error);
  // }

  res.json({
    projects: projects.map(project => project.toObject({ getters: true }))
  });
});

// update project
router.patch("/:pid", async (req: any, res: any, next: any) => {
  const {
    name,
    price,
    status,
    tasks,
    invoiceNo
  } = req.body;

  const projectId = req.params.pid;

  let project: any;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError("Could not update project", 500);
    return next(error);
  }

  // if (project.owner.toString() !== req.userData.customerId) {
  //   const error = new HttpError("Not allowed to edit this place", 401);
  //   return next(error);
  // }

  project.name = name;
  project.price = price;
  project.status = status;
  project.tasks = tasks;
  project.invoiceNo = invoiceNo;

  try {
    await project.save();
  } catch (err) {
    const error = new HttpError("Project updade failed", 500);
    return next(error);
  }

  res.status(200).json({ project: project.toObject({ getters: true }) });
});

// delete project
router.delete("/:pid", async (req: any, res: any, next: any) => {
  const projectId = req.params.pid;

  let project: any;
  try {
    project = await Project.findById(projectId).populate('owner');
  } catch (err) {
    const error = new HttpError("Could not delete project", 500);
    return next(error);
  }

  if (!project) {
    const error = new HttpError("Could not find project for this id", 404);
    return next(error);
  }

  // if (project.owner.id !== req.userData.customerId) {
  //   const error = new HttpError("Not allowed to delete this place", 401);
  //   return next(error);
  // }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await project.remove({ session: sess });
    project.owner.projects.pull(project);
    await project.owner.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Delete project failed", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted project." });
});

// get all projects
router.get("/", async (req: any, res: any, next: any) => {
  let projects;
  try {
    projects = await Project.find().exec();
  } catch (err) {
    const error = new HttpError("Fetching projects failed", 500);
    return next(error);
  }

  //no one allowed to see all projects
  if (req.userData.userId !== '0123456789') {
    const error = new HttpError("Not allowed to see this places", 401);
    return next(error);
  }

  res.json({
    projects: projects.map(project => project.toObject({ getters: true }))
  });
});

// add new project
router.post("/", async (req: any, res: any, next: any) => {
  const {
    name,
    price,
    status,
    owner
  } = req.body;

  const createdProject = new Project({
    created: new Date(),
    name,
    price,
    status,
    tasks: [{
      title: '',
      hours: 0
    }],
    invoiceNo: '0',
    owner
  });

  let customer: any;

  try {
    customer = await Customer.findById(owner);
  } catch (err) {
    const error = new HttpError("Create project failed", 500);
    return next(error);
  }

  if (!customer) {
    const error = new HttpError(
      "Could not find customer for the provided id",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProject.save({ session: sess });
    customer.projects.push(createdProject);
    await customer.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating project failed while customer connection", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ project: createdProject.toObject({ getters: true }) });
});