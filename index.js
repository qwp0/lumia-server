import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./firebase/firebaseAdmin.js";
import slideRouter from "./routes/slides.js";
import roomRouter from "./routes/room.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/slides", slideRouter);
app.use("/room", roomRouter);

app.get("/", (req, res) => {
  res.send("Hello from Lumia Server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
