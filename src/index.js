import { configDotenv } from "dotenv";
import express from "express";
import db from "./db/index.js";
import cors from "cors";
import messageservices from "./routes/messageservices.route.js";
import userservices from "./routes/user.route.js";
import firebaseroutes from "./routes/firebase.route.js";

configDotenv();
const app = express();

//database
db();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(express.static("public"));

app.use("/api/v1", messageservices);
app.use("/api/v1/user", userservices);
app.use("/api/v1/hardware", firebaseroutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
