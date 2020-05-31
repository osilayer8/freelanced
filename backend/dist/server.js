"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_routes_1 = require("./routes/users-routes");
const customers_routes_1 = require("./routes/customers-routes");
const projects_routes_1 = require("./routes/projects-routes");
const http_error_1 = __importDefault(require("./models/http-error"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
app.use("/api/users", users_routes_1.router);
app.use("/api/customers", customers_routes_1.router);
app.use("/api/projects", projects_routes_1.router);
// give back custom error msg if route doesn't exist
app.use((req, res, next) => {
    const error = new http_error_1.default("Could not find this route", 404);
    throw error;
});
// default error when server is not responding
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});
mongoose_1.default
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-f6ait.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
    app.listen(process.env.PORT || 5000);
})
    .catch(err => {
    console.log(err);
});
