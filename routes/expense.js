// Import necessary libraries and modules
const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.render("expenses/index", { expenses });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get the form for creating a new expense
router.get("/new", (req, res) => {
  res.render("expenses/new");
});

// Create a new expense
router.post("/", async (req, res) => {
  const { name, amount, date, category } = req.body;

  try {
    const expense = new Expense({ name, amount, date, category });
    await expense.save();
    res.redirect("/expenses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get the form for editing an existing expense
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);
    res.render("expenses/edit", { expense });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update an existing expense
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, amount, date, category } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(id, {
      name,
      amount,
      date,
      category,
    });
    res.redirect("/expenses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete an existing expense
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findByIdAndDelete(id);
    res.redirect("/expenses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
