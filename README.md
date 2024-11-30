# TooFoot

TooFoot is an engaging game where users guess hidden football players based on their career history. The project is divided into two main parts:
1. **Frontend**: Built with React.
2. **Backend**: Built with Node.js and integrated with MongoDB.

## Features

### Game Rules
- Each user creates an account to play the game.
- Users have levels and scores.
- Each session consists of:
  - 1 minute to guess 3 football players.
  - Players are presented one by one, and the user must guess the current player to proceed to the next.
  - Correct guesses earn points equal to the player's difficulty level (`niveauDifficulte`).
- If all 3 players are guessed correctly:
  - The user levels up.
  - A bonus equal to the next level is awarded.
- If the user fails:
  - The score increases based on the guessed players.
  - A penalty of –`niveau` is applied.
- Additional rules include:
  - `tryNumber` decreases by 1 each session. If it reaches 0:
    - Reset to 5.
    - Decrease level (if possible).
    - Deduct `5*(current level + 1)` from the score (if possible).
  - Scores and levels remain positive.
  - Guesses are valid if they match the player's `nom`, `prenom`, or `nickname`.

  
## Technologies Used

- **Frontend**: React, CSS
- **Backend**: Node.js, Express, MongoDB

- ## Project Structure

```
projet/
├── backend/       # Backend folder
├── frontend/      # Frontend folder
└── README.md      # Project documentation
```


## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js
- npm or yarn
- MongoDB
- Git

## Project Structure

```
projet/
├── backend/       # Backend folder
├── frontend/      # Frontend folder
└── README.md      # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   nodemon index
   ```

4. Ensure a `.env` file is configured with necessary environment variables (e.g., database connection details).
5. 
### Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm start
   ```

### Running the Application
1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to `http://localhost:3000` to interact with the application.


---

Enjoy playing TooFoot!
