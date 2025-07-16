import express from "express";
import { roomStore } from "../stores/roomStore.js";
import { v4 as uuidv4 } from "uuid";

const roomRouter = express.Router();

roomRouter.post("/create", (req, res) => {
  const { slideUrl } = req.body;

  if (!slideUrl) {
    return res.status(400).json({ error: "slideUrl이 필요합니다." });
  }

  const roomId = uuidv4();

  const initialState = {
    slideUrl: slideUrl,
    currentPage: 1,
    drawings: {},
    feedbacks: [],
  };

  roomStore.set(roomId, initialState);

  res.status(201).json({ roomId });
});

roomRouter.get("/:roomId/exists", (req, res) => {
  const { roomId } = req.params;

  const exists = roomStore.has(roomId);

  if (exists) {
    res.status(200).json({ exists: true });
  } else {
    res.status(404).json({ exists: false, message: "존재하지 않는 방입니다." });
  }
});

export default roomRouter;
