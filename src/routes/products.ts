import { Router, Request, Response } from "express";
import admin from "../firebase";

const router = Router();
const db = admin.firestore();

router.get("/", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("products").get(); // Termékek lekérése a Firestore-ból
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
