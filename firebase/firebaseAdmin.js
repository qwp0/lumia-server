import admin from "firebase-admin";
import dotenv from "dotenv";
import "./firebase/firebaseAdmin.js";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const bucket = admin.storage().bucket();
