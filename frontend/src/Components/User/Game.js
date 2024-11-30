import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Game = () => {
  const [user, setUser] = useState(null); // Utilisateur connecté
  const [players, setPlayers] = useState([]); // Joueurs de la tentative
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // Joueur actuel
  const [input, setInput] = useState(''); // Input utilisateur
  const [timer, setTimer] = useState(60); // Timer
  const [hint, setHint] = useState(''); // Message d'indice
  const [victory, setVictory] = useState(false); // État de victoire
  const [failure, setFailure] = useState(false); // État d'échec
  const token = localStorage.getItem('token');

  // Démarrer la tentative
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (!token) {
          console.error("Token manquant. Connectez-vous pour récupérer un token.");
        }
        const response = await axios.post(
          'http://localhost:8000/api/game/startattempt',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayers(response.data.players);
        setUser(response.data.user);
      } catch (error) {
        console.error('Erreur lors de l’initialisation de la tentative :', error);
      }
    };

    fetchGameData();
  }, [token]);

  useEffect(() => {
    if (timer > 0 && !victory && !failure) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !failure) { 
      handleFailure();
    }
  }, [timer, victory, failure]);

  // Vérifier la réponse
  const handleInputChange = (e) => setInput(e.target.value);

  const handleSubmit = async () => {
    const currentPlayer = players[currentPlayerIndex];
    if (
      input.toLowerCase() === currentPlayer.nom.toLowerCase() ||
      input.toLowerCase() === currentPlayer.prenom.toLowerCase() ||
      currentPlayer.nicknames.includes(input.toLowerCase())
    ) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setInput('');
      setHint('');
      if (currentPlayerIndex + 1 === players.length) {
        handleVictory();
      }
    }
  };

  // Gérer la victoire
  const handleVictory = async () => {
    try {
      const playerLevels = players.map((player) => player.niveauDifficulte);
      await axios.post(
        'http://localhost:8000/api/game/victory',
        { playerLevels },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVictory(true);
    } catch (error) {
      console.error('Erreur lors du traitement de la victoire :', error);
    }
  };

  const handleFailure = async () => {
    try {
      const guessedPlayerLevels = players
        .slice(0, currentPlayerIndex)
        .map((player) => player.niveauDifficulte);
  
      await axios.post(
        'http://localhost:8000/api/game/failure',
        { guessedPlayers: guessedPlayerLevels },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFailure(true);
    } catch (error) {
      console.error('Erreur lors du traitement de l’échec :', error);
    }
  };

  // Gérer le bouton "Hint"
  const handleHint = async () => {
    if (timer <= 15) {
      alert("Le temps restant est insuffisant pour demander un indice.");
      return;
    }
    setTimer((prev) => prev - 15);
  
    try {
      const currentPlayer = players[currentPlayerIndex];
      const response = await axios.post('http://localhost:5000/gethint', {
        playerName: currentPlayer.nom,
      });
      setHint(response.data.hint);
      console.log("Hint mis à jour :", response.data);

    } catch (error) {
      console.error('Erreur lors de la récupération de l’indice :', error);
      setHint("Indice indisponible pour le moment.");
    }
  };
  

  return (
    <div>
      <h1>Jeu : Devinez le Joueur</h1>
      {user && (
        <div>
          <h2>Score: {user.score} | Niveau: {user.niveau}</h2>
          <h3>Essais restants: {user.tryNumber}</h3>
        </div>
      )}
      <h2>Temps restant: {timer}s</h2>
      {victory ? (
        <div>
          <h2>Félicitations !</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {players.map((player) => (
              <div key={player._id}>
                <img src={`http://localhost:8000/uploads/${player.image}`} alt={`${player.nom} ${player.prenom}`} style={{ height: 150, width: 150 }} />
                <h3>{player.nom} {player.prenom}</h3>
                <p>{player.description}</p>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.reload()}>Niveau suivant</button>
          <button onClick={() => (window.location.href = '/user')}>Retour à l'espace utilisateur</button>
        </div>
      ) : failure ? (
        <div>
          <h2>Vous avez perdu !</h2>
          <button onClick={() => window.location.reload()}>Réessayer</button>
          <button onClick={() => (window.location.href = '/user')}>Retour à l'espace utilisateur</button>
        </div>
      ) : (
        players[currentPlayerIndex] && (
          <div>
            <h2>Qui est ce joueur ?</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <img
                src={`http://localhost:8000/uploads/${players[currentPlayerIndex].imageCache}`}
                alt="Image cachée"
                style={{ maxHeight: '200px', maxWidth: '200px', objectFit: 'contain' }}
              />
            </div>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Entrez votre réponse"
            />
            <button onClick={handleSubmit}>Valider</button>
            <button onClick={handleHint}>Hint</button>
            {hint && <p style={{ marginTop: '10px', color: 'blue' }}>{hint}</p>}
          </div>
        )
      )}
    </div>
  );
};

export default Game;
