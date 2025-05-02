import { configDotenv } from "dotenv";
import express from "express";
import db from "./db/index.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import messageservices from "./routes/messageservices.route.js";
import userservices from "./routes/user.route.js";
 import firebaseroutes from "./routes/firebase.route.js";

configDotenv();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // adjust this in production
  },
});
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


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// Export io so you can use it in routes
export { io };
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
