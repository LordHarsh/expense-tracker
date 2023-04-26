// Import necessary libraries and modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Initialize the Express application
const app = express();
app.set('view engine', 'ejs');

// Set up the MongoDB connection
mongoose.connect("mongodb://localhost:27017/expense-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Expense model
const Expense = mongoose.model("Expense", {
    name: String,
    amount: Number,
    date: Date,
    category: String,
});

// Configure the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define the routes
app.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({})
        res.render('index', { expenses })
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

app.get("/expenses/new", (req, res) => {
    console.log('work')
    res.render("new");
});

app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.send(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/expenses", async (req, res) => {
    const { name, amount, date, category } = req.body;

    try {
        const expense = new Expense({ name, amount, date, category });
        await expense.save();
        const expenses = await Expense.find();
        res.render('index', { expenses })
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const { name, amount, date, category } = req.body;

    try {
        const expense = await Expense.findByIdAndUpdate(id, {
            name,
            amount,
            date,
            category,
        });
        res.send(expense);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/expenses/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findByIdAndDelete(id);
        res.send(expense);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});
