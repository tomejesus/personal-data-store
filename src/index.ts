import express from "express";
import dotenv from "dotenv";
import sequelize from "./models/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Add root route
app.get("/", (req, res) => {
  res.send("Welcome to the Personal Data Store!");
});

const PORT = process.env.PORT || 3000;

// Use Router instances
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
