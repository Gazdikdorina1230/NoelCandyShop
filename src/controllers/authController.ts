import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../firebase";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, isAdmin = false } = req.body;

    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      return res.status(400).json({ message: "Ez az email már regisztrálva van!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRef.set({ email, password: hashedPassword, isAdmin });

    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a regisztráció során." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(400).json({ message: "Hibás email vagy jelszó!" });
    }

    const userData = userSnap.data();
    const passwordMatch = await bcrypt.compare(password, userData!.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Hibás email vagy jelszó!" });
    }

    const token = jwt.sign({ id: email, isAdmin: userData!.isAdmin }, "secret", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a bejelentkezés során." });
  }
};
