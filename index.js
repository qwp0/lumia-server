import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";

import "./firebase/firebaseAdmin.js";
import slideRouter from "./routes/slides.js";
import roomRouter from "./routes/room.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("소켓 연결: ", socket.id);

  socket.on("disconnect", () => {
    console.log("연결 해제:", socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use("/slides", slideRouter);
app.use("/room", roomRouter);

app.get("/", (req, res) => {
  res.send("Hello from Lumia Server!");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
