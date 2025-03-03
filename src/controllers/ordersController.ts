import { Request, Response } from "express";
import admin from "../firebase"; // Firebase kapcsolat

// Rendelés létrehozása
export const createOrder = async (req: Request, res: Response) => {
  const { userId, items, totalAmount } = req.body;

  try {
    const newOrderRef = admin.firestore().collection("orders").doc();
    const order = {
      userId,
      items,
      totalAmount,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newOrderRef.set(order);
    return res.status(201).json({ message: "Order created", orderId: newOrderRef.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Error creating order" });
  }
};

// Rendelések lekérése
export const getOrders = async (req: Request, res: Response) => {
  try {
    const ordersSnapshot = await admin.firestore().collection("orders").get();
    const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    return res.status(500).json({ error: "Error getting orders" });
  }
};

// Rendelés státuszának frissítése
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const orderRef = admin.firestore().collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    await orderRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: `Order status updated to ${status}` });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Error updating order status" });
  }
};
