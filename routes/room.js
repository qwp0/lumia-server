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

export default roomRouter;
