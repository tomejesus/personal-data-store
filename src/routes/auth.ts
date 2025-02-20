import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models";

dotenv.config();

const router = Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || "default-secret";

// Define the request body interface for signup/login
interface AuthRequestBody {
  email: string;
  password: string;
}

router.post(
  "/signup",
  async (
    req: Request<{}, {}, AuthRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return; // Return undefined, matching void
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: "Email already in use" });
        return; // Return undefined
      }

      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = await User.create({ email, password_hash: passwordHash });

      const token = jwt.sign({ userId: user.user_id }, jwtSecret, {
        expiresIn: "1h",
      });
      res.status(201).json({ token });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Signup failed", error: (err as Error).message });
    }
  }
);

router.post(
  "/login",
  async (
    req: Request<{}, {}, AuthRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return; // Return undefined
      }

      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        res.status(401).json({ message: "Invalid credentials" });
        return; // Return undefined
      }

      const token = jwt.sign({ userId: user.user_id }, jwtSecret, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Login failed", error: (err as Error).message });
    }
  }
);

export default router;
