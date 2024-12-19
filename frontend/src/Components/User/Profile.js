import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar.js"; 
import "./Profile.css";
import medal from "../Assets/medal.png";
import LogoutButton from "./LogoutButton.js";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    level: "",
    ranking: "",
    score: "",
  });

  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
  
      for (const field in updatedProfile) {
        if (
          updatedProfile[field] && 
          updatedProfile[field] !== profile[field] 
        ) {
          const response = await axios.put(
            "http://localhost:8000/api/profile",
            { [field]: updatedProfile[field] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert(response.data.msg);
          setProfile((prev) => ({ ...prev, [field]: updatedProfile[field] }));
        }
      }
  
      setUpdatedProfile({});
    } catch (error) {
    
      console.error("Error updating profile:", error);
    }
  };
  
  
    const [isEditing, setIsEditing] = useState(false);
    const [tempPassword, setTempPassword] = useState(profile.password || "");
  
    const handleToggleEdit = () => {
      if (isEditing) {
        setUpdatedProfile({ ...profile, password: profile.password });
        setTempPassword(profile.password || "");
      }
      setIsEditing(!isEditing);
    };
  
    const handlePasswordChange = (e) => {
      setTempPassword(e.target.value);
      setUpdatedProfile({ ...profile, password: e.target.value });
    };
  

  

  return (
    <div>
      <Navbar username={profile.username} />
      <div className="profile-container">
        <h2 className="profile-title">Welcome to your profile!</h2>
        <div className="profile-wrapper">
          <div className="profile-stats">
            <img src={medal} alt="Gold Medal" className="medal-icon" />
            <div className="rls">
              <p className="p">Ranking : </p> <p className="p" style={{ color: "#0094D3", fontWeight: "400" }}> {profile.ranking || "N/A"} </p>
            </div>
            <div className="rls">
              <p className="p">Score : </p>
              <p className="p" style={{ color: "#0094D3", fontWeight: "400" }}> {profile.score || 0}</p>
            </div>
            <div className="rls">
              <p className="p">Level : </p>
              <p className="p" style={{ color: "#0094D3", fontWeight: "400" }}> {profile.level }</p>
            </div>
          </div>
          <div className="fields-container">
          <div className="profile-fields">
 <div className="div2">
  <div >
    <label htmlFor="firstName">First Name:</label>
    <input
      id="firstName"
      className="profile-input"
      value={updatedProfile.firstname}
      onChange={(e) =>
        setUpdatedProfile({ ...updatedProfile, firstname: e.target.value })
      }
    />
  </div>

  <div >
    <label htmlFor="lastName">Last Name:</label>
    <input
      id="lastName"
      className="profile-input"
      value={updatedProfile.lastname }
      onChange={(e) =>
        setUpdatedProfile({ ...updatedProfile, lastname: e.target.value })
      }
    />
  </div>

  </div>
  <div className="profile-field">
    <label htmlFor="username">Username:</label>
    <input
      id="username"
      className="profile-input"
      value={updatedProfile.username }
      onChange={(e) =>
        setUpdatedProfile({ ...updatedProfile, username: e.target.value })
      }
    />
  </div>

  <div className="profile-field">
    <label htmlFor="email">Email:</label>
    <input
      id="email"
      className="profile-input"
      value={updatedProfile.email}
      onChange={(e) =>
        setUpdatedProfile({ ...updatedProfile, email: e.target.value })
      }
    />
  </div>

  <div className="profile-field">
  <label htmlFor="password">Password:</label>
  <div className="passwordDiv">
    {isEditing ? (
      <div className="pasDiv">
        <input
          id="password"
          type="password"
          className="password-input"
          value={tempPassword}
          placeholder="Enter new password"
          onChange={handlePasswordChange}
        />
        {tempPassword.length > 0 &&
          (tempPassword.length < 8 ? (
            <span className="error-message">
              Password must be at least 8 characters long.
            </span>
          ) : (
            <span className="success-message">Password is valid.</span>
          ))}
      </div>
    ) : (
      <p className="password-display">
        <strong>{"*".repeat(profile.password?.length || 0)}</strong>
      </p>
    )}
    <button className="toggle-password-button" onClick={handleToggleEdit}>
      {isEditing ? "Reset Password" : "Change Password"}
    </button>
  </div>
</div>


    <button
      className="profile-button"
      onClick={() => {
        handleSave(); 
      }}
    >
Edit Profile    </button>
  </div>

</div>


        </div>
      </div>
      <LogoutButton buttonColor="#00025D" />
    </div>
  );
};

export default Profile;
