document.addEventListener('DOMContentLoaded', function() {

    const jokeList = document.getElementById('joke-list');
    const randomJokeButton = document.getElementById('random-joke-button');
    const newJokeForm = document.getElementById('new-joke-form');
    const categorySearchForm = document.getElementById('category-search-form');


    // Fetch a random joke
    randomJokeButton.addEventListener('click', function () {
        fetch('/jokebook/random')
            .then(response => response.json())
            .then(joke => {
                alert(`${joke.setup} - ${joke.delivery}`);
            })
            .catch(error => {
                console.error('Error fetching random joke:', error.message);
            });
    });

    // Add a new joke
    newJokeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(newJokeForm);
        const newJoke = {
            category: formData.get('category'),
            setup: formData.get('setup'),
            delivery: formData.get('delivery')
        };

        console.log('New joke data:', newJoke);

        fetch('/jokebook/joke/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newJoke)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add joke');
                }
                return response.json();
            })
            .then(updatedCategory => {
                console.log('Updated category:', updatedCategory);
                jokeList.innerHTML = '';
                updatedCategory.jokes.forEach(joke => {
                    const jokeItem = document.createElement('li');
                    jokeItem.textContent = `${joke.setup} - ${joke.delivery}`;
                    jokeList.appendChild(jokeItem);
                });
                newJokeForm.reset();
            })
            .catch(error => {
                alert(error.message);
            });
    });

    // Handle category search
    categorySearchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const categoryInput = document.getElementById('category-search');
        const category = categoryInput.value.trim();

        if (!category) {
            alert('Please enter a category.');
            return;
        }

        // Fetch jokes for the entered category
        fetch(`/jokebook/joke/${category}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('No jokes found for this category.');
                    }
                    throw new Error('Failed to fetch jokes for the category.');
                }
                return response.json();
            })
            .then(jokes => {
                jokeList.innerHTML = ''; // Clear the joke list
                if (jokes.length === 0) {
                    jokeList.innerHTML = '<li>No jokes found for this category.</li>';
                } else {
                    jokes.forEach(joke => {
                        const jokeItem = document.createElement('li');
                        jokeItem.textContent = `${joke.setup} - ${joke.delivery}`;
                        jokeList.appendChild(jokeItem);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching jokes:', error.message);
                jokeList.innerHTML = `<li>${error.message}</li>`;
            });
    });
});