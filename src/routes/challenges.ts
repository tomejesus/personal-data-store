import { Router, Request, Response, NextFunction } from "express";
import { JwtPayload, VerifyErrors, Jwt, verify } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Challenge } from "../models";

dotenv.config();

const router = Router();
const jwtSecret = process.env.JWT_SECRET || "default-secret";

// Extend Request to include user from JWT
declare module "express" {
  interface Request {
    user?: JwtPayload & { userId: number };
  }
}

// Middleware to verify JWT
const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  jwt.verify(
    token,
    jwtSecret,
    (
      err: VerifyErrors | null,
      decoded: JwtPayload | Jwt | string | undefined
    ) => {
      if (err) {
        res.status(403).json({ message: "Invalid token" });
        return;
      }

      if (typeof decoded === "string") {
        res.status(403).json({
          message: "Invalid token format: string payload not supported",
        });
        return;
      }

      if (!decoded || !("userId" in decoded)) {
        res.status(403).json({ message: "Invalid token data" });
        return;
      }

      req.user = decoded as JwtPayload & { userId: number };
      next();
    }
  );
};

// GET /challenges
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const challenges = await Challenge.findAll({
        attributes: ["challenge_id", "challenge_name"],
      });
      console.log("Challenges:", challenges);
      res.status(200).json(challenges);
    } catch (err) {
      res.status(500).json({
        message: "Failed to fetch challenges",
        error: (err as Error).message,
      });
    }
  }
);

export default router;
