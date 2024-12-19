import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './PlayerList.css';


const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/players", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  const deletePlayer = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/player/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player._id !== id));
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  return (
    <div className="player-list-container">
      <ul className="player-list">
        {players.map((player) => (
          <li key={player._id} className="player-item">
            <div className="player-details">
              {console.log(player.image)}
              <img
                src={`http://localhost:8000/uploads/${player.image}` || "/default-player.jpg"} 
                alt={`${player.firstname} ${player.lastname}`}
                className="player-image"
              />
              <div className="player-info">
                {player.firstname} {player.lastname}
              </div>
            </div>
            <div className="player-actions">
              <button
                onClick={() => deletePlayer(player._id)}
                className="delete-button"
              >
                Delete
              </button>
              <button
                onClick={() => navigate(`/admin/edit-player/${player._id}`)}
                className="edit-button"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default PlayerList;
