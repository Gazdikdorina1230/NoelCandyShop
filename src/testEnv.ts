import "dotenv/config";

console.log("Firebase Project ID:", process.env.FIREBASE_PROJECT_ID);
console.log("Firebase Client Email:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("Firebase Private Key (rövidítve):", process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30) + "...");
