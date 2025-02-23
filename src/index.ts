import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import "./firebase";
import authRouter from "./routes/auth";
import cartsRouter from "./routes/carts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(` Szerver fut a http://localhost:${PORT} címen`);
});
