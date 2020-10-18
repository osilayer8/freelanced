"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const projects_1 = __importDefault(require("../models/projects"));
const customers_1 = __importDefault(require("../models/customers"));
const http_error_1 = __importDefault(require("../models/http-error"));
const check_auth_1 = __importDefault(require("../middleware/check-auth"));
exports.router = express_1.default.Router();
exports.router.use(check_auth_1.default);
// get project
exports.router.get("/:pid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqId = yield req.params.pid;
    let project;
    try {
        project = yield projects_1.default.findById(reqId);
    }
    catch (err) {
        const error = new http_error_1.default("Looking for project failed!", 500);
        return next(error);
    }
    if (!project) {
        const error = new http_error_1.default("Could not find an project", 404);
        return next(error);
    }
    // if (project.toObject().owner.toString() !== req.userData.customerId) {
    //   const error = new HttpError("Not allowed to see this place", 401);
    //   return next(error);
    // }
    res.json({ project: project.toObject({ getters: true }) });
}));
// get projects by customer id
exports.router.get("/customer/:cid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.cid;
    let projects;
    try {
        projects = yield projects_1.default.find({ owner: customerId });
    }
    catch (err) {
        const error = new http_error_1.default("Could not find customer", 500);
        return next(error);
    }
    if (!projects || projects.length === 0) {
        return next(new http_error_1.default("Could not find projects for the provided customer id", 404));
    }
    // if (projects[0].toObject().owner.toString() !== req.userData.customerId) {
    //   const error = new HttpError("Not allowed to see this places", 401);
    //   return next(error);
    // }
    res.json({
        projects: projects.map(project => project.toObject({ getters: true }))
    });
}));
// update project
exports.router.patch("/:pid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, status, tasks, invoiceNo, additionalPdfText } = req.body;
    const projectId = req.params.pid;
    let project;
    try {
        project = yield projects_1.default.findById(projectId);
    }
    catch (err) {
        const error = new http_error_1.default("Could not update project", 500);
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
    project.additionalPdfText = additionalPdfText;
    try {
        yield project.save();
    }
    catch (err) {
        const error = new http_error_1.default("Project updade failed", 500);
        return next(error);
    }
    res.status(200).json({ project: project.toObject({ getters: true }) });
}));
// delete project
exports.router.delete("/:pid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.pid;
    let project;
    try {
        project = yield projects_1.default.findById(projectId).populate('owner');
    }
    catch (err) {
        const error = new http_error_1.default("Could not delete project", 500);
        return next(error);
    }
    if (!project) {
        const error = new http_error_1.default("Could not find project for this id", 404);
        return next(error);
    }
    // if (project.owner.id !== req.userData.customerId) {
    //   const error = new HttpError("Not allowed to delete this place", 401);
    //   return next(error);
    // }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield project.remove({ session: sess });
        project.owner.projects.pull(project);
        yield project.owner.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        const error = new http_error_1.default("Delete project failed", 500);
        return next(error);
    }
    res.status(200).json({ message: "Deleted project." });
}));
// get all projects
exports.router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let projects;
    try {
        projects = yield projects_1.default.find().exec();
    }
    catch (err) {
        const error = new http_error_1.default("Fetching projects failed", 500);
        return next(error);
    }
    //no one allowed to see all projects
    if (req.userData.userId !== '0123456789') {
        const error = new http_error_1.default("Not allowed to see this places", 401);
        return next(error);
    }
    res.json({
        projects: projects.map(project => project.toObject({ getters: true }))
    });
}));
// add new project
exports.router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, status, owner } = req.body;
    const createdProject = new projects_1.default({
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
    let customer;
    try {
        customer = yield customers_1.default.findById(owner);
    }
    catch (err) {
        const error = new http_error_1.default("Create project failed", 500);
        return next(error);
    }
    if (!customer) {
        const error = new http_error_1.default("Could not find customer for the provided id", 404);
        return next(error);
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdProject.save({ session: sess });
        customer.projects.push(createdProject);
        yield customer.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        const error = new http_error_1.default("creating project failed while customer connection", 500);
        return next(error);
    }
    res
        .status(201)
        .json({ project: createdProject.toObject({ getters: true }) });
}));
