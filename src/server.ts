import express from "express";
import dotenv from "dotenv";
import productsRoutes from "./routes/products";
import cartsRoutes from "./routes/carts";
import ordersRoutes from "./routes/orders";
import authMiddleware from "./middleware/authMiddleware";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/carts", authMiddleware, cartsRoutes);
app.use("/api/orders", authMiddleware, ordersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
