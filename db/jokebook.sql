-- Drop tables if they already exist
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS jokes;

-- Create the categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Create the jokes table
CREATE TABLE jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    setup TEXT NOT NULL,
    delivery TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Insert initial categories
INSERT INTO categories (name) VALUES
('funnyJoke'),
('lameJoke');

-- Insert initial jokes for funnyJoke category
INSERT INTO jokes (category_id, setup, delivery) VALUES
((SELECT id FROM categories WHERE name = 'funnyJoke'), 'Why did the student eat his homework?', 'Because the teacher told him it was a piece of cake!'),
((SELECT id FROM categories WHERE name = 'funnyJoke'), 'What kind of tree fits in your hand?', 'A palm tree'),
((SELECT id FROM categories WHERE name = 'funnyJoke'), 'What is worse than raining cats and dogs?', 'Hailing taxis');

-- Insert initial jokes for lameJoke category
INSERT INTO jokes (category_id, setup, delivery) VALUES
((SELECT id FROM categories WHERE name = 'lameJoke'), 'Which bear is the most condescending?', 'Pan-DUH'),
((SELECT id FROM categories WHERE name = 'lameJoke'), 'What would the Terminator be called in his retirement?', 'The Exterminator');