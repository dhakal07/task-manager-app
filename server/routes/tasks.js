const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Build a filter that includes user's tasks AND old tasks without userId (compat)
const compatFilter = (userId) => ({
  $or: [{ userId }, { userId: { $exists: false } }],
});

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const { title, priority, dueDate, completed } = req.body;
    if (!title) return res.status(400).json({ message: "❌ 'title' field is required" });

    const task = new Task({
      title,
      priority: priority || "Low",
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: !!completed,
      userId: req.user, // set from auth middleware
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in POST /api/tasks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// READ (list)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find(compatFilter(req.user)).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error in GET /api/tasks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE (title/priority/dueDate/completed) — single route for all updates
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, priority, dueDate, completed } = req.body;

    const task = await Task.findOne({ _id: req.params.id, ...compatFilter(req.user) });
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

    if (title !== undefined) task.title = title;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) task.completed = completed;

    // Migrate legacy tasks to have userId
    if (!task.userId) task.userId = req.user;

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    console.error("Error in PUT /api/tasks/:id:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, ...compatFilter(req.user) });
    if (!deleted) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.json({ message: "Task deleted", _id: req.params.id });
  } catch (err) {
    console.error("Error in DELETE /api/tasks/:id:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
