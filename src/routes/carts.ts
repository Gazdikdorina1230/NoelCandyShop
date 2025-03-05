import express from "express";
import { addToCart, getCart } from "../controllers/cartController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);

export default router;