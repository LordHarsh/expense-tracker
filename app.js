
const express = require('express')
const mongodb = require('mongodb')
const dotenv = require('dotenv')
const ejs = require('ejs')
const { body, validationResult } = require('express-validator');

dotenv.config()

const app = express()

// set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const port = process.env.PORT || 5000

const client = new mongodb.MongoClient(mongoUri || 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
 

// middleware for parsing incoming request bodies
app.use(express.urlencoded({ extended: true }));

client.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');

    // start the server
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});

// define routes
app.get('/', (req, res) => {
    const expenses = client.db().collection('expenses').find().toArray((err, expenses) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Working')
            res.render('index', { expenses });
        }
    });
});

app.post('/expenses', [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Name is required'),
    body('amount').trim().isLength({ min: 1 }).withMessage('Amount is required').toFloat(),
    body('date').trim().isLength({ min: 1 }).withMessage('Date is required').toDate(),
    body('category').trim().isLength({ min: 1 }).escape().withMessage('Category is required'),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const expenses = client.db().collection('expenses').find().toArray((err, expenses) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('index', { expenses, errors: errors.array() });
        }
      });
    } else {
      const expense = {
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category,
      };
      client.db().collection('expenses').insertOne(expense, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.redirect('/');
        }
      });
    }
  });



// app.listen(port, () => {
//     console.log('Server is listening on port 5000...');
// })