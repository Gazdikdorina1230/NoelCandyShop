import { Request, Response } from "express";
import admin from "../firebase";

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const cartRef = admin.firestore().collection("carts").doc(userId);
    const cartSnapshot = await cartRef.get();

    if (!cartSnapshot.exists) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.status(200).json(cartSnapshot.data());
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({ error: "Error fetching cart" });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  const { items } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid cart items format" });
  }

  try {
    const cartRef = admin.firestore().collection("carts").doc(userId);
    await cartRef.set({ items, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Error updating cart" });
  }
};
