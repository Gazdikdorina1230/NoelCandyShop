import { Router } from "express";
import { getCart, updateCart } from "../controllers/cartsController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getCart); // Kosár lekérése (védett)
router.post("/", authMiddleware, updateCart); // Kosár frissítése (védett)

export default router;
