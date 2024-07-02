import express, { Application } from "express";
import cors from "cors";
import UserRouter from "./app/modules/user/user.route";


const app: Application = express();

cors
app.use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRouter);


export default app;
