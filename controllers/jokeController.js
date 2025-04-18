const fetch = require('node-fetch'); // Import node-fetch

class JokeController {
    constructor(jokeModel) {
        this.jokeModel = jokeModel;
    }

    async getCategories(req, res) {
        try {
            console.log('Fetching categories...');
            const categories = await this.jokeModel.fetchCategories();
            res.json(categories);
        } catch (error) {
            console.error('Error in getCategories:', error.message);
            res.status(500).json({ message: 'Error retrieving categories' });
        }
    }

    async getJokesByCategory(req, res) {
        try {
            const category = req.params.category;

            // Fetch jokes from the local database
            const jokes = await this.jokeModel.fetchJokesByCategory(category);

            if (jokes.length > 0) {
                // If jokes exist in the local database, return them
                return res.json(jokes);
            }

            // If the category does not exist, fetch jokes from the external API
            console.log(`Category "${category}" not found locally. Fetching from external API...`);
            const externalJokes = await this.fetchJokesFromExternalAPI(category);

            if (externalJokes.length === 0) {
                return res.status(404).json({ message: 'No jokes found for this category in the external API' });
            }

            // Add the new category and jokes to the local database
            await this.jokeModel.addCategoryWithJokes(category, externalJokes);

            // Return the jokes
            res.json(externalJokes);
        } catch (error) {
            console.error('Error in getJokesByCategory:', error.message);
            res.status(500).json({ message: 'Error fetching jokes' });
        }
    }

    async fetchJokesFromExternalAPI(category) {
        try {
            const response = await fetch(`https://v2.jokeapi.dev/joke/${category}?type=twopart&amount=3&safe-mode`);
            const data = await response.json();

            if (data.error || !data.jokes) {
                console.error('Error fetching jokes from external API:', data.message || 'Unknown error');
                return [];
            }

            // Map the external jokes to the format used in your database
            return data.jokes.map(joke => ({
                setup: joke.setup,
                delivery: joke.delivery
            }));
        } catch (error) {
            console.error('Error fetching jokes from external API:', error.message);
            return [];
        }
    }

    async getRandomJoke(req, res) {
        try {
            const joke = await this.jokeModel.fetchRandomJoke();
            res.json(joke);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving random joke' });
        }
    }

    async addJoke(req, res) {
        try {
            const { category, setup, delivery } = req.body;

            // Validate input
            if (!category || !setup || !delivery) {
                return res.status(400).json({ message: 'All fields are required: category, setup, delivery' });
            }

            // Add the joke to the database
            const updatedCategory = await this.jokeModel.insertJoke(category, setup, delivery);
            res.json({ message: 'Joke added successfully', jokes: updatedCategory });
        } catch (error) {
            console.error('Error in addJoke:', error.message);
            res.status(500).json({ message: 'Error adding joke' });
        }
    }
}

module.exports = JokeController;