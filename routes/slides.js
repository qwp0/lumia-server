import express from "express";
import multer from "multer";

const slideRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("PDF 파일만 업로드 가능합니다."), false);
    }
    cb(null, true);
  },
});

export default slideRouter;
