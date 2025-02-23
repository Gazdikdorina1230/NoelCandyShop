import { Router, Request, Response } from "express";
import { auth } from "firebase-admin";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email és jelszó szükséges." });
  }

  try {
    const userRecord = await auth().createUser({ email, password });
    return res.status(201).json({ message: "Sikeres regisztráció!", uid: userRecord.uid });
  } catch (error: any) {
    return res.status(400).json({ message: "Hiba a regisztrációnál.", error: error.message });
  }
});

export default router;
