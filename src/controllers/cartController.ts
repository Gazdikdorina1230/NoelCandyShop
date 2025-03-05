import { Request, Response } from "express";
import { db } from "../firebase";
import { AuthRequest } from "../middleware/authMiddleware";

export const addToCart = async (req: AuthRequest, res: Response) => {
  // Termék hozzáadása a kosárhoz
};

export const getCart = async (req: AuthRequest, res: Response) => {
  // Kosár lekérése
};