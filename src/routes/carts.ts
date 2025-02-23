import { Router, Request, Response } from "express";
import { db } from "../firebase";
import { Timestamp } from "firebase-admin/firestore";

const router = Router();

// 🛒 Kosár lekérdezése
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cartsRef = db.collection("carts");
    const cartQuery = await cartsRef.where("userId", "==", userId).get();

    if (cartQuery.empty) {
      return res.status(404).json({ message: "Kosár nem található." });
    }

    const cartDoc = cartQuery.docs[0];
    const cartData = cartDoc.data();

    res.status(200).json({ id: cartDoc.id, ...cartData });
  } catch (error) {
    console.error("Hiba a kosár lekérdezésénél:", error);
    res.status(500).json({ message: "Szerverhiba a kosár lekérdezésekor." });
  }
});

// ➕ Termék hozzáadása a kosárhoz
router.post("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number") {
    return res.status(400).json({ message: "Hiányzó vagy hibás adatok." });
  }

  try {
    const cartsRef = db.collection("carts");
    const cartQuery = await cartsRef.where("userId", "==", userId).get();

    if (cartQuery.empty) {
      // Új kosár létrehozása
      const newCart = {
        userId,
        items: [{ productId, quantity }],
        updatedAt: Timestamp.now(),
      };
      const cartDocRef = await cartsRef.add(newCart);
      return res.status(201).json({ message: "Kosár létrehozva.", id: cartDocRef.id, cart: newCart });
    } else {
      // Létező kosár frissítése
      const cartDoc = cartQuery.docs[0];
      const cartData = cartDoc.data();
      const items = cartData.items || [];

      const existingItemIndex = items.findIndex((item: any) => item.productId === productId);

      if (existingItemIndex !== -1) {
        // Ha a termék már a kosárban van, mennyiség növelése
        items[existingItemIndex].quantity += quantity;
      } else {
        // Új termék hozzáadása a kosárhoz
        items.push({ productId, quantity });
      }

      await cartDoc.ref.update({
        items,
        updatedAt: Timestamp.now(),
      });

      return res.status(200).json({ message: "Kosár frissítve.", items });
    }
  } catch (error) {
    console.error("Hiba a kosár frissítésekor:", error);
    res.status(500).json({ message: "Szerverhiba a kosár frissítésekor." });
  }
});

export default router;
