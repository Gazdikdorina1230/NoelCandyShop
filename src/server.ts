import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(" Szerver működik!");
});

app.listen(PORT, () => {
  console.log(` Szerver fut a http://localhost:${PORT} címen`);
});
