import mongoose from "mongoose";
import dotenv from "dotenv";
import Account from "../models/account.js";

dotenv.config();

const accounts = [
  {
    accountId: "ACC003",
    balance: 11250,
    transactions: [
      { type: "deposit", amount: 500 },
      { type: "transfer_out", amount: 1250, accountId: "ACC002" },
    ],
  },
  {
    accountId: "ACC002",
    balance: 900,
    transactions: [
      { type: "deposit", amount: 650 },
      { type: "transfer_in", amount: 250, accountId: "ACC001" },
    ],
  },
  {
    accountId: "ACC004",
    balance: 500,
    transactions: [{ type: "deposit", amount: 500 }],
  },
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  const indexes = await Account.collection.indexes();
  if (indexes.some((index) => index.name === "accoundId_1")) {
    await Account.collection.dropIndex("accoundId_1");
  }
  await Account.syncIndexes();

  const results = await Promise.all(
    accounts.map((account) =>
      Account.updateOne(
        { accountId: account.accountId },
        { $setOnInsert: account },
        { upsert: true }
      )
    )
  );

  const created = results.filter((result) => result.upsertedCount === 1).length;
  console.log(`Seed completed: ${created} created, ${accounts.length - created} already existed`);
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
