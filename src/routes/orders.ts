import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/ordersController"; // Biztosítva, hogy a createOrder is importálva van
import authMiddleware from "../middleware/authMiddleware"; // Az auth middleware is importálva

const router = Router();

// Rendelés létrehozása (POST)
router.post("/", authMiddleware, createOrder);

// Rendelések lekérése (GET)
router.get("/", authMiddleware, getOrders);

// Rendelés státuszának frissítése (PUT)
router.put("/:orderId/status", authMiddleware, updateOrderStatus);

export default router;
