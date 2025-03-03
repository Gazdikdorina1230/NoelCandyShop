import { Request, Response } from "express";
import admin from "../firebase";

// Kosár lekérése a felhasználó ID alapján
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  
  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    const cartRef = admin.firestore().collection("carts").doc(userId);
    const cartSnapshot = await cartRef.get();

    if (!cartSnapshot.exists) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartData = cartSnapshot.data();
    return res.status(200).json(cartData);
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({ error: "Error fetching cart" });
  }
};

// Kosár frissítése (termék hozzáadása a kosárhoz)
export const updateCart = async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  const { items } = req.body; // Kosár elemek (termékek és mennyiség)

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }

  try {
    const cartRef = admin.firestore().collection("carts").doc(userId);
    await cartRef.set({ items }, { merge: true }); // A kosár adatokat frissítjük vagy létrehozzuk

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Error updating cart" });
  }
};
