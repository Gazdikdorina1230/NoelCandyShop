import { Router } from "express";
import { getCart, updateCart } from "../controllers/cartsController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// Kosár lekérése (authMiddleware biztosítja, hogy a felhasználó be legyen jelentkezve)
router.get("/", authMiddleware, getCart);

// Kosár frissítése (termékek hozzáadása)
router.put("/", authMiddleware, updateCart);

export default router;
