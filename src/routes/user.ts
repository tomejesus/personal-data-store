import { Router, Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, JwtPayload, Jwt } from "jsonwebtoken"; // Assuming JWT is fixed
import dotenv from "dotenv";
import { Challenge, User } from "../models";

dotenv.config();

const router = Router();
const jwtSecret = process.env.JWT_SECRET || "default-secret";

// Extend Request to include user from JWT
declare module "express" {
  interface Request {
    user?: JwtPayload & { userId: number }; // More specific type for our token
  }
}

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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
          message: "Invalid token data: string payload not supported",
        });
        return;
      }
      if (!decoded || !("userId" in decoded)) {
        res.status(403).json({ message: "Invalid token data" });
        return;
      }
      const payload = decoded as JwtPayload & { userId: number };
      req.user = payload;
      next();
    }
  );
};

// Define survey data interface
interface SurveyData {
  name?: string;
  location?: string;
  age_range?: string;
  interaction_preference?: string;
  other_interaction_preference?: string;
  challenges?: number[]; // challenge_ids
}

router.put(
  "/",
  authenticateToken,
  async (
    req: Request<{}, {}, SurveyData>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(403).json({ message: "User ID not found in token" });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const {
        name,
        location,
        age_range,
        interaction_preference,
        other_interaction_preference,
        challenges,
      } = req.body;

      await user.update({
        name,
        location,
        age_range,
        interaction_preference,
        other_interaction_preference,
      });

      // Sync challenges (delete old, add new)
      await user.setChallenges([]);
      if (challenges && challenges.length > 0) {
        const challengeInstances = await Challenge.findAll({
          where: { challenge_id: challenges },
        });
        await user.setChallenges(challengeInstances);
      }

      res.json({ message: "Survey updated" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Update failed", error: (err as Error).message });
    }
  }
);

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(403).json({ message: "User ID not found in token" });
        return;
      }

      const user = await User.findByPk(userId, { include: [Challenge] });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Use getChallenges() or the included Challenges
      const challenges = await user.getChallenges();
      const response = {
        name: user.name,
        location: user.location,
        age_range: user.age_range,
        interaction_preference: user.interaction_preference,
        other_interaction_preference: user.other_interaction_preference,
        challenges: challenges.map((c: Challenge) => ({
          id: c.challenge_id,
          name: c.challenge_name,
        })),
      };

      res.json(response);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Fetch failed", error: (err as Error).message });
    }
  }
);

export default router;
