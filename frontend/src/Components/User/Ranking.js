import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Ranking = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/ranking', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Classement</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '10px' }}>Classement</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Pseudo</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '10px' }}>{player.classement}</td>
              <td
                style={{
                  border: '1px solid black',
                  padding: '10px',
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/player/${player._id}`)}
              >
                {player.pseudo}
              </td>
              <td style={{ border: '1px solid black', padding: '10px' }}>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
