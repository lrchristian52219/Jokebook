# Jokebook

Jokebook is a full-stack application that allows users to view and add jokes categorized into different types. The application is built using Node.js and Express for the backend, with SQLite as the database to store jokes and categories. The frontend can be rendered using EJS templates.

## Features

- **View Joke Categories**: Retrieve a list of available joke categories.
- **View Jokes by Category**: Fetch jokes based on the selected category.
- **Random Joke**: Get a random joke from the database.
- **Add a New Joke**: Submit a new joke to a specified category.

## Project Structure

```
Jokebook
├── controllers          # Contains the logic for handling requests
│   └── jokeController.js
├── models               # Contains the database models
│   └── jokeModel.js
├── routes               # Contains the route definitions
│   └── jokeRoutes.js
├── views                # Contains the EJS templates for rendering
│   ├── index.ejs
│   ├── categories.ejs
│   └── jokes.ejs
├── db                   # Contains the SQLite database
│   └── jokebook.sqlite
├── public               # Contains static files (CSS, JS)
│   ├── css
│   │   └── styles.css
│   └── js
│       └── scripts.js
├── app.js              # Entry point of the application
├── package.json        # NPM configuration file
├── .gitignore          # Specifies files to ignore in Git
└── README.md           # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Jokebook
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints

- `GET /jokebook/categories`: Retrieve a list of joke categories.
- `GET /jokebook/joke/:category`: Retrieve jokes from a specified category.
- `GET /jokebook/random`: Retrieve a random joke.
- `POST /jokebook/joke/add`: Add a new joke to the database.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.