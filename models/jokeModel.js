class JokeModel {
    constructor(db) {
        this.db = db;
    }

    fetchCategories() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT name FROM categories';
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows); // Return all categories
            });
        });
    }

    fetchJokesByCategory(category) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT jokes.setup, jokes.delivery
                FROM jokes
                INNER JOIN categories ON jokes.category_id = categories.id
                WHERE categories.name = ?
            `;
            this.db.all(query, [category], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    fetchRandomJoke() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1';
            this.db.get(query, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    insertJoke(category, setup, delivery) {
        return new Promise((resolve, reject) => {
            const findCategoryQuery = 'SELECT id FROM categories WHERE name = ?';
            const insertCategoryQuery = 'INSERT INTO categories (name) VALUES (?)';
            const insertJokeQuery = 'INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)';
            const fetchJokesQuery = `
                SELECT setup, delivery
                FROM jokes
                WHERE category_id = ?
            `;

            // Capture the correct `this` context
            const db = this.db;

            // Find or create the category
            db.get(findCategoryQuery, [category], (err, row) => {
                if (err) {
                    return reject(err);
                }

                if (!row) {
                    // Category not found, create it
                    db.run(insertCategoryQuery, [category], function (err) {
                        if (err) {
                            return reject(err);
                        }

                        const categoryId = this.lastID; // Get the ID of the newly created category

                        // Insert the joke
                        db.run(insertJokeQuery, [categoryId, setup, delivery], function (err) {
                            if (err) {
                                return reject(err);
                            }

                            // Fetch updated jokes for the category
                            db.all(fetchJokesQuery, [categoryId], (err, rows) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(rows);
                            });
                        });
                    });
                } else {
                    // Category found, use its ID
                    const categoryId = row.id;

                    // Insert the joke
                    db.run(insertJokeQuery, [categoryId, setup, delivery], function (err) {
                        if (err) {
                            return reject(err);
                        }

                        // Fetch updated jokes for the category
                        db.all(fetchJokesQuery, [categoryId], (err, rows) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                    });
                }
            });
        });
    }

    addCategoryWithJokes(category, jokes) {
        return new Promise((resolve, reject) => {
            const insertCategoryQuery = 'INSERT INTO categories (name) VALUES (?)';
            const insertJokeQuery = 'INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)';

            // Insert the new category
            this.db.run(insertCategoryQuery, [category], function (err) {
                if (err) {
                    return reject(err);
                }

                const categoryId = this.lastID; // Get the ID of the newly created category

                // Insert the jokes for the new category
                const jokeInsertPromises = jokes.map(joke => {
                    return new Promise((resolve, reject) => {
                        this.db.run(insertJokeQuery, [categoryId, joke.setup, joke.delivery], function (err) {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });

                // Wait for all jokes to be inserted
                Promise.all(jokeInsertPromises)
                    .then(() => resolve())
                    .catch(reject);
            });
        });
    }
}

module.exports = JokeModel;