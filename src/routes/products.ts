import { Router, Request, Response } from "express";
import { db } from "../firebase";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Nincsenek termékek!" });
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(products);
  } catch (error) {
    console.error("Hiba a termékek lekérdezésekor:", error);
    return res.status(500).json({ message: "Hiba történt a termékek lekérésekor." });
  }
});

export default router;
