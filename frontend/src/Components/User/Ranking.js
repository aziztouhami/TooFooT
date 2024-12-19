import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './Ranking.css';
import LogoutButton from './LogoutButton';

const Ranking = () => {
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState("");

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
    fetchRanking();
  }, []);

  return (
    <div className="rank">
      <Navbar username={username} />
      <div className="ranking-content">
        <h2 className="title-leaderboard">Leaderboard</h2>
        <div className="leaderboard">
          <table className="ranktable">
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  className={`${
                    player.username === username ? "current-user" : index % 2 === 0 ? "even-row" : "odd-row"
                  }`}
                >
                  <td>{player.ranking}</td>
                  <td onClick={() => navigate(`../player/${player._id}`)}>
  {player.username}
</td>

                  <td>{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <LogoutButton buttonColor="#FFFFFF" />
    </div>
  );
};

export default Ranking;
