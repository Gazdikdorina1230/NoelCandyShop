import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthRequest extends Request {
  user?: { id: string; isAdmin?: boolean };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Nincs token megadva!" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid, isAdmin: decodedToken.admin || false };
    next();
  } catch (error) {
    res.status(403).json({ message: "Érvénytelen token!" });
  }
};