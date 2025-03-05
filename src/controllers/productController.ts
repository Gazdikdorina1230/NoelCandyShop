import { Request, Response } from "express";
import { db } from "../firebase";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productsSnapshot = await db.collection("products").get();
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a termékek lekérésekor." });
  }
};
