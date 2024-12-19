import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import profile from "../Assets/profile.png";

const Navbar = ({ username }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() !== "") {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:8000/api/search?username=${searchTerm}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSearchResults(response.data.slice(0, 4)); 
          console.log(searchResults)
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleNavigate = (userId) => {
    navigate(`../player/${userId}`);
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="Logo2" onClick={() => navigate("/user")} />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search For Player..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="search-result-item"
                onClick={() => handleNavigate(user._id)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="userinfo" onClick={() => navigate("/user/profile")}>
        <p className="username">{username}</p>
        <img src={profile} alt="Profile" className="profile-icon" />
      </button>
    </nav>
  );
};

export default Navbar;
