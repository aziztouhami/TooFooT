import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OtherPlayerProfile = () => {
  const { id } = useParams(); // Récupère l'id du joueur depuis l'URL
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/user/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayer(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil du joueur:', error);
      }
    };

    fetchPlayerProfile();
  }, [id]);

  if (!player) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Profil du joueur</h2>
      <p><strong>Nom:</strong> {player.nom}</p>
      <p><strong>Prénom:</strong> {player.prenom}</p>
      <p><strong>Pseudo:</strong> {player.pseudo}</p>
      <p><strong>Score:</strong> {player.score}</p>
      <p><strong>Classement:</strong> {player.classement}</p>
      <p><strong>Niveau:</strong> {player.niveau}</p>
    </div>
  );
};

export default OtherPlayerProfile;
