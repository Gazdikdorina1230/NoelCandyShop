import express from "express";
import { placeOrder, getOrders } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getOrders);

export default router;