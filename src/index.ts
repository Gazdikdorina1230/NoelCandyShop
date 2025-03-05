import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware";
import productsRoutes from "./routes/products";
import cartsRoutes from "./routes/carts";
import ordersRoutes from "./routes/orders";

const app = express();

app.use(cors()); // Engedélyezett kereszt-domain kérések
app.use(express.json()); // JSON formátumú adatok kezelése

// Átjárók a különböző útvonalakhoz
app.use("/api/products", productsRoutes); // Termékek
app.use("/api/carts", authMiddleware, cartsRoutes); // Kosár (védett)
app.use("/api/orders", authMiddleware, ordersRoutes); // Rendelések (védett)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
