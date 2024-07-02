import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import Joi from "joi";
require("dotenv").config();

export const createUser = async (req: Request, res: Response) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    const userinfo: IUser = req.body;
    const { email, password } = userinfo;
    const { error } = schema.validate({
      email,
      password,
    });

    if (error) {
      res.status(200).json({ message: error.message });
    } else {
      const enryptedpass = await bcrypt.hash(password, 10);
      const alreayExist = await User.findOne({ email: email });
      if (alreayExist) {
        res.status(200).send({ message: "User Is Alreay Exist" });
      } else {
        const user = new User({
          email,
          password: enryptedpass,
        });

        const userData = await user.save();
        res.status(200).send({ message: "success", userId: userData._id });
      }
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    console.log("Error in Create User part - >", error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const userinfo = req.body;
    const { email, password } = userinfo;
    const validuser = await User.findOne({ email: email });

    if (validuser) {
      const validPass = await bcrypt.compare(password, validuser.password);

      if (validPass) {
        const token = jwt.sign(
          { email: validuser.email },
          `${process.env.JWT_SECRET}`,
          { expiresIn: "1d" }
        );
        res.status(200).send({ message: "Login Successful", data: token , validuser });
      } else {
        res.send({ message: "password not Match" });
      }
    } else {
      res.send({ message: "user not Valid" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    console.log("Error in Login User part - >", error);
  }
};

export const getLoginUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const secretKey: Secret = process.env.JWT_SECRET || "fallbackSecret"; // Cast to Secret type
    const user = jwt.verify(token, secretKey) as { email: string };
    const userEmail = user.email;
    const userdata = await User.findOne({ email: userEmail }).select(
      "-password"
    );

    if (userdata) {
      res.status(200).send({ message: "Successful", data: userdata });
    } else {
      res.status(400).send({ message: "Not Valid User" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    console.log("Error in get Login User part - >", error);
  }
};
