import mongoose from "mongoose";
import app from "./app";
const port = process.env.PORT || 3001;

require("dotenv").config();
// conncet with mongodb atlas
const mongoUrl = `${process.env.BASE_URL}`
const mongooseOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3001, // Set a longer timeout (default is 30000)
};

async function mongodbConnect() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("databes connected");
    app.get("/", (req, res) => {
      res.send("Website is running");
    });
    app.listen(port, () => {
      console.log(` app listening on port ${port}`);
    });
  } catch (e) {
    console.log("server err", e);
  }
}

mongodbConnect();
