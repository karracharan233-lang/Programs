const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

// GET /api/habits?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const filter = { userId: req.query.userId || "demo-user" };
    if (req.query.date) filter.date = req.query.date;
    const habits = await Habit.find(filter).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch habits" });
  }
});

// POST /api/habits
router.post("/", async (req, res) => {
  try {
    const { habitName, date, target, userId } = req.body;
    if (!habitName || !date) {
      return res.status(400).json({ message: "habitName and date are required" });
    }
    const habit = await Habit.create({
      habitName,
      date,
      target: target || "",
      userId: userId || "demo-user"
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ message: "Could not create habit" });
  }
});

// PUT /api/habits/:id
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["habitName", "date", "target", "completed"];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    const habit = await Habit.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: "Could not update habit" });
  }
});

// DELETE /api/habits/:id
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json({ message: "Habit deleted", id: habit._id });
  } catch (error) {
    res.status(400).json({ message: "Could not delete habit" });
  }
});

module.exports = router;
