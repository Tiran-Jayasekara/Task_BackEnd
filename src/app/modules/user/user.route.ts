import express from "express";
import { createUser, getLoginUser, loginUser } from "./user.controller";
const UserRouter = express.Router();
UserRouter.post("/register", createUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/get-user", getLoginUser);

export default UserRouter;
