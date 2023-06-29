// Import necessary libraries and modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();

// Initialize the Express application
const app = express();
app.set('view engine', 'ejs');

const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

// Set up the MongoDB connection
mongoose.connect(mongoURI, {
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

app.post('/filter', async (req, res) => {
    const { category } = req.body;
    try {
      const expenses = await Expense.find({ category });
      res.render('index', { expenses });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/filter/date', async (req, res) => {
    const { month, year } = req.body;
  
    if (!month || !year) {
      return res.redirect('/');
    }
  
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
  
    try {
      const expenses = await Expense.find({ date: { $gte: startDate, $lte: endDate } });
      res.render('index', { expenses });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
   

app.get("/expenses/new", (req, res) => {
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
        res.redirect('/')
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Get the form for editing an existing expense
app.get("/expenses/:id/edit", async (req, res) => {
    const { id } = req.params;
  
    try {
      const expense = await Expense.findById(id);
      res.render("edit", { expense });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });  
  
app.post("/expenses/:id/edit", async (req, res) => {
    const { id } = req.params;
    const { name, amount, date, category } = req.body;

    try {
        const expense = await Expense.findByIdAndUpdate(id, { 
            name,
            amount,
            date,
            category,
        });
        res.redirect('/')
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/expenses/:id/delete", async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findByIdAndDelete(id);
        res.redirect('/')
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}); 



// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
