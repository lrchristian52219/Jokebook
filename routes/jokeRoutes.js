const express = require('express');

module.exports = (jokeController, app, jokeModel) => {
    const router = express.Router();

    router.get('/categories', jokeController.getCategories.bind(jokeController));
    router.get('/joke/:category', jokeController.getJokesByCategory.bind(jokeController));
    router.get('/random', jokeController.getRandomJoke.bind(jokeController));
    router.post('/joke/add', jokeController.addJoke.bind(jokeController));
 
    return router;
};