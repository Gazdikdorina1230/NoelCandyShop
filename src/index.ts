import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware";
import productsRoutes from "./routes/products";
import cartsRoutes from "./routes/carts";
import ordersRoutes from "./routes/orders";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/carts", authMiddleware, cartsRoutes);
app.use("/api/orders", authMiddleware, ordersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
