import { Request, Response } from "express";
import admin from "../firebase";

// Rendelés létrehozása
export const createOrder = async (req: any, res: Response) => {
  const { items } = req.body;
  const userId = req.user?.uid; // A hitelesített felhasználó UID-ja

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

// Az összes rendelés lekérése a bejelentkezett felhasználóhoz
export const getOrders = async (req: any, res: Response) => {
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

// Egy adott rendelés lekérése ID alapján
export const getOrder = async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.uid;

  if (!id || !userId) {
    return res.status(400).json({ error: "Order ID and User ID are required" });
  }

  try {
    const orderDoc = await admin.firestore().collection("orders").doc(id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderDoc.data();

    // Ellenőrizzük, hogy a rendelést a felhasználó hozta-e létre
    if (order?.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You cannot access this order" });
    }

    return res.status(200).json({ id: orderDoc.id, ...order });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order" });
  }
};
