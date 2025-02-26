import { Router } from "express";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import authenticateToken from "../middleware/authenticateToken";

const router = Router();

// 🔎 Segédfüggvény a kosár dokumentum hivatkozásához
const getCartDocRef = (userId: string) => doc(collection(db, "carts"), userId);

/**
 * 🛒 GET /carts/my-cart
 * Saját kosár lekérése (hitelesítést igényel)
 */
router.get("/my-cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "Hiányzó felhasználói azonosító." });

    const cartRef = getCartDocRef(userId);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      return res.status(200).json({ items: [] }); // Üres kosár, ha nincs dokumentum
    }

    res.status(200).json(cartDoc.data());
  } catch (error) {
    console.error("Hiba a kosár lekérésekor:", error);
    res.status(500).json({ message: "Hiba a kosár lekérésekor." });
  }
});

/**
 * ➕ POST /carts/add
 * Termék hozzáadása a kosárhoz
 * 🔑 Header: Authorization: Bearer <token>
 * 📝 Body példa:
 * {
 *   "productId": "abc123",
 *   "quantity": 2
 * }
 */
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Hiányzó mezők (userId, productId, quantity)." });
    }

    const cartRef = getCartDocRef(userId);
    const cartDoc = await getDoc(cartRef);

    let updatedItems = [];

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const existingItem = cartData.items.find((item: any) => item.productId === productId);

      if (existingItem) {
        // Ha létezik, frissítjük a mennyiséget
        updatedItems = cartData.items.map((item: any) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Új termék a kosárhoz
        updatedItems = [...cartData.items, { productId, quantity }];
      }
    } else {
      // Nincs kosár dokumentum, újat hozunk létre
      updatedItems = [{ productId, quantity }];
    }

    await setDoc(cartRef, { userId, items: updatedItems, updatedAt: new Date() });
    res.status(200).json({ message: "Termék sikeresen hozzáadva a kosárhoz." });
  } catch (error) {
    console.error("Hiba a termék hozzáadásakor:", error);
    res.status(500).json({ message: "Hiba a termék hozzáadásakor." });
  }
});

/**
 * 🗑️ DELETE /carts/remove/:productId
 * Termék eltávolítása a kosárból
 */
router.delete("/remove/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Hiányzó felhasználói azonosító vagy termékazonosító." });
    }

    const cartRef = getCartDocRef(userId);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      return res.status(404).json({ message: "Kosár nem található." });
    }

    const updatedItems = cartDoc.data().items.filter((item: any) => item.productId !== productId);
    await updateDoc(cartRef, { items: updatedItems, updatedAt: new Date() });

    res.status(200).json({ message: "Termék eltávolítva a kosárból." });
  } catch (error) {
    console.error("Hiba a termék eltávolításakor:", error);
    res.status(500).json({ message: "Hiba a termék eltávolításakor." });
  }
});

/**
 * 🧹 DELETE /carts/clear
 * Kosár teljes kiürítése
 */
router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "Hiányzó felhasználói azonosító." });
    }

    const cartRef = getCartDocRef(userId);
    await deleteDoc(cartRef);

    res.status(200).json({ message: "Kosár sikeresen kiürítve." });
  } catch (error) {
    console.error("Hiba a kosár törlésekor:", error);
    res.status(500).json({ message: "Hiba a kosár törlésekor." });
  }
});

export default router;
