import { Request, Response } from "express";
import admin from "../firebase";

export const createOrder = async (req: Request, res: Response) => {
  const { items } = req.body;
  const userId = req.user?.uid;

  if (!items || !userId) {
    return res.status(400).json({ error: "Items and user ID are required" });
  }

  try {
    const orderRef = await admin.firestore().collection("orders").add({
      userId,
      items,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ id: orderRef.id });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const ordersSnapshot = await admin.firestore().collection("orders")
      .where("userId", "==", userId)
      .get();

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

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
    return res.status(500).json({ error: "Error updating order status" });
  }
};
