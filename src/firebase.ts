import admin from "firebase-admin";
import dotenv from "dotenv";
const serviceAccount = require("../serviceAccountKey.json");

dotenv.config();

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Firebase környezeti változók hiányoznak!");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase inicializálva!");

export const db = admin.firestore();
