const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const JokeModel = require('./models/jokeModel');
const JokeController = require('./controllers/jokeController');
const jokeRoutes = require('./routes/jokeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection
const db = new sqlite3.Database('./db/jokebook.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize model and controller
const jokeModel = new JokeModel(db);
const jokeController = new JokeController(jokeModel);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/jokebook', jokeRoutes(jokeController)); // Pass the controller to the routes

// Landing page
app.get('/', async (req, res) => {
    try {
        const categories = await jokeModel.fetchCategories(); // Fetch all categories from the database
        res.render('index', { categories }); // Pass categories to the EJS template
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Error loading page');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});