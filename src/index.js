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

// ✅ CORS for Express
app.use(cors({
  origin: "*", // or replace with your frontend URL like "https://yourfrontend.com"
  methods: ["GET", "POST"],
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Routes
app.use("/api/v1", messageservices);
app.use("/api/v1/user", userservices);
app.use("/api/v1/hardware", firebaseroutes);

// ✅ Optional: endpoint to help with Render testing
app.get("/socket.io/", (req, res) => {
  res.send("Socket endpoint ready.");
});

// ✅ Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
});

// ✅ Handle connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Optional: send a welcome message or ping
  socket.emit("connected", { message: "Connected to socket server!" });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Export io if needed in other files (optional)
export { io };

// ✅ Connect to DB and start server
db();
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
