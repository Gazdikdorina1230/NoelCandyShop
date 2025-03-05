import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/ordersController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createOrder); // Rendelés létrehozása (védett)
router.get("/", authMiddleware, getOrders); // Rendelések lekérése (védett)
router.put("/:orderId/status", authMiddleware, updateOrderStatus); // Rendelés státuszának frissítése

export default router;
