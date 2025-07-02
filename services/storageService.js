import { getDownloadURL } from "firebase-admin/storage";
import { bucket } from "../firebase/firebaseAdmin.js";

export const uploadFile = async (file) => {
  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const publicUrl = await getDownloadURL(fileRef);

    return publicUrl;
  } catch (error) {
    throw new Error("파일 업로드 중 오류가 발생했습니다.");
  }
};
