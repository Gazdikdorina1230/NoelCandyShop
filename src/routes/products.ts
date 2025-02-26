import { Router } from "express";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const router = Router();

// GET /products - Összes termék lekérése
router.get("/", async (req, res) => {
  try {
    const productsRef = collection(db, "products"); // ✅ ÚJ szintaxis
    const snapshot = await getDocs(productsRef); // Dokumentumok lekérése

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), // Dokumentum adatai
    }));

    res.status(200).json(products); // JSON válasz a termékekkel
  } catch (error) {
    console.error("Hiba a termékek lekérésekor:", error);
    res.status(500).json({ message: "Hiba a termékek lekérésekor." });
  }
});

export default router;
