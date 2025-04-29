import { configDotenv } from "dotenv";
import express from "express";
import db from "./db/index.js";
import cors from "cors";
configDotenv();
const app = express();

//database
db();

//middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


