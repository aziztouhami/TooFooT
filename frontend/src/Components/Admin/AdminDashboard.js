import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddPlayer from "./FootballPlayer/AddPlayer";
import PlayerList from './FootballPlayer/PlayerList';
import EditPlayer from './FootballPlayer/EditPlayer';
import UserList from './Users/UserList';
import './AdminDashboard.css';
import LogoutButton from '../User/LogoutButton';
import AdminProfile from './AdminProfile';
import profile from "../Assets/profile.png";
import axios from 'axios';
const AdminDashboard = () => {
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
  return (
    <div className='dashboard-container'>
      <Routes>
        <Route path="/add-player" element={<AddPlayer />} />
        <Route path="/edit-player/:id" element={<EditPlayer />} />
        <Route path="/profile" element={<AdminProfile />} />

        <Route
          path="/"
          element={
            <>
              <div className="conts">
                <button className='admininfo' onClick={() => navigate("/admin/profile")}> <p className="adminusername">{username}</p>
                        <img src={profile} alt="Profile" className="adminprofile-icon" /></button>
                <h1 className="cont-title">Users</h1>
                <div className="user-conte">
                <div className='user-cont-div'>

                  <UserList />
                  </div>

                </div>
              </div>

              <div className="conts">
                <h1 className="cont-title">Football Players</h1>
                <div className="player-cont">
                <div className='player-cont-div'>
                  <PlayerList />
                  </div>
                  <button
                    onClick={() => navigate("/admin/add-player")}
                    className="add-button"
                  >
                    Add Player
                  </button>
                </div>
              </div>
              <LogoutButton buttonColor="#FFFFFF" />
              </>
          }
        />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
