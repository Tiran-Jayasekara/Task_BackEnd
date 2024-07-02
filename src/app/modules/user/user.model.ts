import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userScema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

export const User = model("User", userScema);
