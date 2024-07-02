"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const UserRouter = express_1.default.Router();
UserRouter.post("/register", user_controller_1.createUser);
UserRouter.post("/login", user_controller_1.loginUser);
UserRouter.post("/get-user", user_controller_1.getLoginUser);
exports.default = UserRouter;
