import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";

import slideRouter from "./routes/slides.js";
import roomRouter from "./routes/room.js";
import { roomStore } from "./stores/roomStore.js";
import { deleteFileFromS3 } from "./services/storageService.js";

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

  socket.on("join_room", ({ roomId, nickname, role }) => {
    const room = roomStore.get(roomId);

    if (!room) {
      socket.emit("error_message", "유효하지 않은 발표방입니다.");
      return;
    }

    socket.join(roomId);
    console.log(
      `${role === "host" ? "[발표자]" : ""}${nickname} 님이 ${roomId} 방에 입장`
    );

    socket.emit("init_room", {
      slideUrl: room.slideUrl,
      currentPage: room.currentPage,
      feedbacks: room.feedbacks || [],
      drawings: room.drawings || {},
    });
  });

  socket.on("text-feedback", ({ roomId, page, nickname, role, text }) => {
    const room = roomStore.get(roomId);
    if (!room) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newFeedback = {
      nickname,
      role,
      time: formattedTime,
      text,
      page,
    };

    if (!Array.isArray(room.feedbacks)) {
      room.feedbacks = [];
    }

    room.feedbacks.push(newFeedback);

    socket.emit("text-feedback", newFeedback);
    socket.to(roomId).emit("text-feedback", newFeedback);
  });

  socket.on("cursor-move", ({ roomId, page, x, y, nickname }) => {
    const room = roomStore.get(roomId);
    if (!room) return;

    const cursorData = { roomId, page, x, y, nickname };

    console.log(`[cursor-move] ${nickname} at page ${page}: (${x}, ${y})`);

    socket.to(roomId).emit("cursor-move", cursorData);
  });

  socket.on("slide-change", ({ roomId, page }) => {
    const room = roomStore.get(roomId);
    if (!room) return;

    room.currentPage = page;
    console.log(`[slide-change] ${roomId} -> page ${page}`);
    socket.to(roomId).emit("slide-change", { page });
  });

  socket.on("current-page", (roomId) => {
    const room = roomStore.get(roomId);
    if (!room) return;

    socket.emit("current-page", { page: room.currentPage });
  });

  socket.on("draw-data", ({ roomId, page, drawings }) => {
    const room = roomStore.get(roomId);
    if (!room) return;

    room.drawings[page] = { drawings };

    socket.to(roomId).emit("draw-data", { page, drawings });
  });

  socket.on("presentation-end", async ({ roomId }) => {
    const room = roomStore.get(roomId);
    if (!room) return;

    console.log(`[presentation-end] 발표 종료됨: ${roomId}`);

    socket.to(roomId).emit("presentation-end");
    const slideUrl = room.slideUrl;
    const key = slideUrl?.split(".amazonaws.com/")[1];

    if (key) {
      await deleteFileFromS3(key);
    }
    roomStore.delete(roomId);
  });

  socket.on("disconnect", () => {
    console.log("연결 해제:", socket.id);
  });
});

app.use(
  cors({
    origin: [process.env.CLIENT_DEV_ORIGIN, process.env.CLIENT_PROD_ORIGIN],
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use("/slides", slideRouter);
app.use("/room", roomRouter);

app.get("/", (req, res) => {
  res.send("Hello from Lumia Server!");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
