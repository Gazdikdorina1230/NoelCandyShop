import { Request, Response } from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 📩 Regisztráció
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.status(201).json({ message: "Sikeres regisztráció!", uid: userRecord.uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 🔑 Bejelentkezés
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);

    // 🔑 JWT token generálás
    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Sikeres bejelentkezés!", token });
  } catch (error: any) {
    res.status(400).json({ error: "Érvénytelen email vagy jelszó." });
  }
};
