import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        console.error("Erreur lors de la récupération des joueurs :", error);
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
      console.error("Erreur lors de la suppression du joueur :", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Liste des joueurs</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {players.map((player) => (
          <li
            key={player._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div>
              {player.nom} {player.prenom}
            </div>
            <div>
              <button
                onClick={() => deletePlayer(player._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
              >
                Supprimer
              </button>
              <button
                onClick={() => navigate(`/edit-player/${player._id}`)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Modifier
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/add-player")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Ajouter un joueur
      </button>
    </div>
  );
};

export default PlayerList;
