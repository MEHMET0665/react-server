import express from "express";
import Account from "../models/account.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { fromAccountId, toAccountId } = req.body ?? {};
  const amount = Number(req.body?.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }
  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: "Accounts must be different" });
  }

  const accounts = await Account.find({
    accountId: { $in: [fromAccountId, toAccountId] },
  });
  if (accounts.length !== 2) {
    return res.status(404).json({ error: "Account not found" });
  }

  const sender = accounts.find((account) => account.accountId === fromAccountId);
  const receiver = accounts.find((account) => account.accountId === toAccountId);
  if (sender.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  sender.balance -= amount;
  receiver.balance += amount;
  sender.transactions.push({ type: "transfer_out", amount, accountId: toAccountId });
  receiver.transactions.push({ type: "transfer_in", amount, accountId: fromAccountId });
  await Promise.all([sender.save(), receiver.save()]);

  res.status(201).json({
    fromBalance: sender.balance,
    toBalance: receiver.balance,
  });
});

export default router;
