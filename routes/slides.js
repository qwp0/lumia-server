import express from "express";
import multer from "multer";
import { uploadFile } from "../services/storageService.js";

const slideRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("PDF 파일만 업로드 가능합니다."), false);
    }
    cb(null, true);
  },
});

slideRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "파일을 찾을 수 없습니다." });
    }
    req.file.originalname = Buffer.from(
      req.file.originalname,
      "latin1"
    ).toString("utf8");
    const publicUrl = await uploadFile(req.file);
    res.status(201).json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default slideRouter;
