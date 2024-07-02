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
exports.getLoginUser = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
const joi_1 = __importDefault(require("joi"));
require("dotenv").config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    });
    try {
        const userinfo = req.body;
        const { email, password } = userinfo;
        const { error } = schema.validate({
            email,
            password,
        });
        if (error) {
            res.status(200).json({ message: error.message });
        }
        else {
            const enryptedpass = yield bcrypt_1.default.hash(password, 10);
            const alreayExist = yield user_model_1.User.findOne({ email: email });
            if (alreayExist) {
                res.status(200).send({ message: "User Is Alreay Exist" });
            }
            else {
                const user = new user_model_1.User({
                    email,
                    password: enryptedpass,
                });
                const userData = yield user.save();
                res.status(200).send({ message: "success", userId: userData._id });
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error in Create User part - >", error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userinfo = req.body;
        const { email, password } = userinfo;
        const validuser = yield user_model_1.User.findOne({ email: email });
        if (validuser) {
            const validPass = yield bcrypt_1.default.compare(password, validuser.password);
            if (validPass) {
                const token = jsonwebtoken_1.default.sign({ email: validuser.email }, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
                res.status(200).send({ message: "Login Successful", data: token, validuser });
            }
            else {
                res.send({ message: "password not Match" });
            }
        }
        else {
            res.send({ message: "user not Valid" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error in Login User part - >", error);
    }
});
exports.loginUser = loginUser;
const getLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const secretKey = process.env.JWT_SECRET || "fallbackSecret"; // Cast to Secret type
        const user = jsonwebtoken_1.default.verify(token, secretKey);
        const userEmail = user.email;
        const userdata = yield user_model_1.User.findOne({ email: userEmail }).select("-password");
        if (userdata) {
            res.status(200).send({ message: "Successful", data: userdata });
        }
        else {
            res.status(400).send({ message: "Not Valid User" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error in get Login User part - >", error);
    }
});
exports.getLoginUser = getLoginUser;
