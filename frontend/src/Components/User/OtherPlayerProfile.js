import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import LogoutButton from './LogoutButton';
import './OtherPlayerProfile.css';
import otherPlayerImage from '../Assets/profileicon.png';

const OtherPlayerProfile = () => {
  const { id } = useParams(); 
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/user/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayer(response.data);
      } catch (error) {
        console.error('Error fetching player profile:', error);
      }
    };

    fetchPlayerProfile();
  }, [id]);

  useEffect(() => {
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
  }, []);

  if (!player) return <p>Loading...</p>;

  return (
    <div className="player-style">
      <Navbar username={username} />
      <div className='player-background'>
      <div className="profile-wrap">
        <img src={otherPlayerImage} alt="Player" className="player" />
        <h2 className='username1'>{player.username}</h2>
        <div className="div3">
          
        <p className='profile-name' style={{marginRight:'3px'}}>{player.firstname}</p>
        
       
        <p className='profile-name'  style={{marginLeft:'3px'}}> {player.lastname}</p>
        
        </div>
        <p className='player-ach'><strong>Ranking :</strong> <span>{player.ranking}</span></p>
        <p className='player-ach'><strong>Score :</strong><span> {player.score}</span></p>
        <p className='player-ach'><strong>Level :</strong><span> {player.level}</span></p>
      </div>
      <LogoutButton buttonColor="#FFFFFF" />
      </div>
    </div>
  );
};

export default OtherPlayerProfile;
