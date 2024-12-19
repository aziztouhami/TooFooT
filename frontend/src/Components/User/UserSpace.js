import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.js";
import LogoutButton from "./LogoutButton"; 
import "./UserSpace.css";

const UserSpace = () => {
  const [userData, setUserData] = useState({ score: 0, level: "Beginner" });
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          "http://localhost:8000/api/profile",
          config
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/"); 
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="user-space">
      <Navbar username={username} />
      <div className="user-space-content">
        <h1>Welcome to Your Space ⚽</h1>
        <h3>Let the game begin!</h3>
        <div className="containerw">
          <p className="titleIcon">🏆</p>
          <p>
            Ranking : <span >{userData.ranking}</span>
          </p>
          <p>
            Score : <span>{userData.score}</span>
          </p>
          <p>
            Level : <span>{userData.level}</span>
          </p>
          <div className="buttons">
            <button
              className="btn btn-ranking"
              onClick={() => navigate("/user/ranking")}
            >
              Ranking
            </button>
            <button
              className="btn btn-start-game"
              onClick={() => navigate("/user/game")}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>

      <LogoutButton buttonColor="#FFFFFF" />
    </div>
  );
};

export default UserSpace;
