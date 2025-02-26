import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/user";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token hiányzik." });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({ message: "Érvénytelen token." });
    }

    // 👇 Itt adjuk hozzá a `user` property-t a `req`-hez
    req.user = decoded as UserPayload;
    next();
  });
};

export default authenticateToken;
