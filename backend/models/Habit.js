const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "demo-user", trim: true },
    habitName: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    target: { type: String, default: "" },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
