/* eslint-disable no-undef */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import accountRoutes from "./routes/accountRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bank API is running",
    endpoints: [
      "GET /accounts/:accountId/balance",
      "GET /accounts/:accountId/transactions",
      "POST /accounts/:accountId/deposits",
      "POST /transfers",
    ],
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.use("/accounts", accountRoutes);
    app.use("/transfers", transferRoutes);

    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
  }
}

startServer();
