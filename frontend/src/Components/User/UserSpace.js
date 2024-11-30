import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserSpace = () => {
  const [userData, setUserData] = useState({ score: 0, niveau: "Débutant" });
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState('');

  useEffect(() => {
    const fetchPseudo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/pseudo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPseudo(response.data.pseudo);
      } catch (error) {
        console.error('Erreur lors de la récupération du pseudo:', error);
      }
    };

    fetchPseudo();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("http://localhost:8000/api/profile", config);
        setUserData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        navigate("/"); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
      }
    };

    fetchUserData();
  }, [navigate]);

  return (<div>
    <div style={{ padding: '20px', textAlign: 'center' }}>
      
        <span>{pseudo}</span>
        <img
          src="/profile-icon.png" // Remplacez par le chemin de votre icône
          alt="Profile"
          style={{ cursor: 'pointer', marginLeft: '10px' }}
          onClick={() => navigate('/profile')}
        />
     
    </div>
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenue dans votre espace utilisateur</h1>
      <p>Score : <strong>{userData.score}</strong></p>
      <p>Niveau : <strong>{userData.niveau}</strong></p>
      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/ranking")}
        >
          Ranking
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate('/game')}
        >
Démarrer le Jeu        </button>
      </div>
    </div>
    </div>
  );
};

export default UserSpace;
