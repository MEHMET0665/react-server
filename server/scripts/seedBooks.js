/* eslint-disable no-undef */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/book.js";

dotenv.config();

const books = [
  {
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    context:
      "First published in 1865. A classic fantasy story following Alice through a strange world of curious characters and impossible logic.",
  },
  {
    title: "Frankenstein or The Modern Prometheus",
    author: "Mary Shelley",
    context:
      "First published in 1818. A gothic science fiction novel about Victor Frankenstein, his experiment, and the creature he brings to life.",
  },
  {
    title: "The Wonderful Wizard of Oz",
    author: "L. Frank Baum",
    context:
      "First published in 1899. A children's fantasy adventure about Dorothy Gale's journey through Oz with the Scarecrow, Tin Woodman, and Cowardly Lion.",
  },
  {
    title: "The Time Machine",
    author: "H. G. Wells",
    context:
      "First published in 1895. A science fiction story about time travel, distant futures, dystopia, and human evolution.",
  },
  {
    title: "The Lost World",
    author: "Arthur Conan Doyle",
    context:
      "First published in 1900. An adventure and science fiction novel about exploration, prehistoric life, and Professor Challenger.",
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    context:
      "First published in 1897. A gothic horror novel about Count Dracula, vampires, fear, pursuit, and supernatural mystery.",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    context:
      "First published in 1932. A dystopian science fiction novel about social control, technology, conditioning, and manufactured happiness.",
  },
  {
    title: "The Jewel of Seven Stars",
    author: "Bram Stoker",
    context:
      "First published in 1902. A horror and mystery novel involving archaeology, Egyptian antiquities, mummies, and ancient power.",
  },
  {
    title: "The Iron Heel",
    author: "Jack London",
    context:
      "First published in 1907. A political dystopian novel about oligarchy, revolution, socialism, and resistance.",
  },
  {
    title: "Flatland",
    author: "Edwin Abbott Abbott",
    context:
      "First published in 1884. A mathematical fiction classic about dimensions, geometry, society, and imagination.",
  },
  {
    title: "The Invisible Man",
    author: "H. G. Wells",
    context:
      "A science fiction novel about experiments, invisibility, isolation, mental instability, and the consequences of unchecked ambition.",
  },
  {
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    context:
      "First published in 1949. A dystopian political novel about surveillance, censorship, authoritarian control, and resistance.",
  },
];

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const book of books) {
      const result = await Book.updateOne(
        { title: book.title },
        { $setOnInsert: book },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        insertedCount += 1;
      } else {
        skippedCount += 1;
      }
    }

    console.log(`Seed complete. Inserted: ${insertedCount}. Skipped existing: ${skippedCount}.`);
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedBooks();
