import { Request, Response } from "express";
import { db } from "../firebase";
import { AuthRequest } from "../middleware/authMiddleware";

export const placeOrder = async (req: AuthRequest, res: Response) => {
  // Rendelés leadása
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  // Felhasználó rendeléseinek lekérése
};