import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Game.css";
import Navbar from "./Navbar";
import timer1 from "../Assets/Too (1).mp4";
import Timer from "./Timer";
import Hint from "./Hint";
import lose from '../Assets/JobSphere (14).png'




const Game = () => {
  const [username, setUsername] = useState("");

  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(60);
  const [hint, setHint] = useState("");
  const [victory, setVictory] = useState(false);
  const [failure, setFailure] = useState(false);
  


  const token = localStorage.getItem("token");


 
  

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (!token) {
          console.error("Token missing. Please log in to retrieve a token.");
          return;
        }
        const response = await axios.post(
          "http://localhost:8000/api/game/startattempt",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
          setPlayers(response.data.players);
          setUser(response.data.user);
        
      } catch (error) {
        console.error("Error initializing the attempt:", error);
      }
    };
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/username", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
    fetchGameData();
    
  }, [token]);


  const handleInputChange = (e) => setInput(e.target.value);

  const handleSubmit = async () => {
    const currentPlayer = players[currentPlayerIndex];
    if (
      input.toLowerCase() === currentPlayer.firstname.toLowerCase() ||
      input.toLowerCase() === currentPlayer.lastname.toLowerCase() ||
      currentPlayer.nicknames.includes(input.toLowerCase())
    ) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setInput("");
      setHint("");
      if (currentPlayerIndex + 1 === players.length) {
        handleVictory();
      }
    }
  };

  const handleVictory = async () => {
    try {
      const playerLevels = players.map((player) => player.niveauDifficulte);
      await axios.post(
        "http://localhost:8000/api/game/victory",
        { playerLevels },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVictory(true);
    } catch (error) {
      console.error("Error handling victory:", error);
    }
  };

  const handleFailure = async () => {
    try {
      const guessedPlayerLevels = players
        .slice(0, currentPlayerIndex)
        .map((player) => player.niveauDifficulte);

      await axios.post(
        "http://localhost:8000/api/game/failure",
        { guessedPlayers: guessedPlayerLevels },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFailure(true);
    } catch (error) {
      console.error("Error handling failure:", error);
    }
  };

  const handleHint = async () => {
    console.log(timer)
    if (timer <= 15) { 
      alert("Insufficient time remaining to request a hint.");
      return;
    }
    setTimer((prev) => prev - 15);

    try {
      const currentPlayer = players[currentPlayerIndex];
      const response = await axios.post("http://localhost:5000/gethint", {
        playerName: currentPlayer.nicknames[0],
      });

      const hintMessage = response.data.hint;
      const parts = hintMessage.split("\n");
      const left = parts.slice(0, 2).join("\n");
      const right = parts.slice(2).join("\n");

      setHint({ left, right });
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHint({ left: "", right: "Hint unavailable at the moment." });
    }
  };

  return (
    <div className="game-container">
      <Navbar username={username} />
      <div className="game-container2">
        <h1 className="game-title"> Guess the Player </h1>
        {user && (
          <div className="user-stats">
            <h3>
              Score: {user.score} | Level: {user.level}
            </h3>
          </div>
        )}
        {victory ? (
          <div className="victory-container">
            <h2>Congratulations!</h2>
            <div className="player-cards">
              {players.map((player) => (
                <div className="player-card" key={player._id}>
                  <img className="player-card-img"
                    src={`http://localhost:8000/uploads/${player.image}`}
                    alt={`${player.firstname} ${player.lastname}`}
                  />
                  <h3 className="player-card-h3">
                  {player.firstname} {player.lastname}                  </h3>
                  <p className="player-card-p">{player.description}</p>
                </div>
              ))}
            </div>
            <div className="vic-buttons">
            <button className="vic-b-1" onClick={() => window.location.reload()}>Next Level</button>
            <button className="vic-b-2"onClick={() => (window.location.href = "/user")}>
              Return to User Space
            </button>
            </div>
          </div>
        ) : failure ? (
          <div className="modal-overlay">
            <div className="modal">
              <img src={lose} alt="Player" className="player" />
              
              <h2>You Lost!</h2>
              <div className="modal-buttons">
                <button style={{backgroundColor: '#00025D'}} onClick={() => window.location.reload()}>Retry</button>
                <button style={{backgroundColor: 'rgb(226, 83, 83)'}} onClick={() => (window.location.href = "/user")}>
                  Return to User Space
                </button>
              </div>
            </div>
          </div>
        ) : (
          players[currentPlayerIndex] && (
            <div className="player-input-container">
              <Timer
                timer={timer}
                setTimer={setTimer}
                onTimeout={handleFailure}
                videoSrc={timer1}
              />
              <img
                src={`http://localhost:8000/uploads/${players[currentPlayerIndex].imageCache}`}
                alt="Hidden Image"
                className="hidden-image"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="div-input">
                  <input
                    type="text"
                    value={input}
                    className="sub-input"
                    onChange={handleInputChange}
                    placeholder="Enter your answer"
                  />
                  <button className="sub-button" type="submit">
                    Submit
                  </button>
                  <button
        className="hint-button"
        type="button"
        onClick={handleHint}
        disabled={timer <= 15}
      >
        Hint
      </button>
                </div>
              </form>
              <Hint hint={hint} handleHint={handleHint} timer={timer} />

              <h4
                className={`trynumber ${
                  user.level === 0
                    ? "infinite"
                    : user.tryNumber === 1
                    ? "red"
                    : user.tryNumber === 2
                    ? "orange"
                    : "black"
                }`}
              >
                Remaining Attempts: {user.level === 0 ? "∞" : user.tryNumber}
              </h4>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Game;
