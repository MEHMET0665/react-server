import express from "express";
import User from "./../models/user.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser){
      return res.status(404).json({error:'User not found'});
    }
    res.json({message:'user deleted succesfully', user:deletedUser})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
