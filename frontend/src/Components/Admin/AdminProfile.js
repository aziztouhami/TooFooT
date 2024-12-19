import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminProfile.css";
import LogoutButton from "../User/LogoutButton.js";
import returnAdd from '../Assets/Return.png'
import { useNavigate } from "react-router-dom";



const AdminProfile = () => {
      const navigate = useNavigate();
    
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  
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
    
        
      <div className="adminprofile-container">
      <button className="return-prf" onClick={()=>navigate('/admin')}> <img src={returnAdd} alt="Player" className="prf-return-img" /></button>

        <h2 className="adminprofile-title">Welcome to your profile!</h2>
          
          <div className="adminfields-container">
          <div className="adminprofile-fields">
 <div className="admindiv2">
  <div >
    <label htmlFor="firstName">First Name:</label>
    <input
      id="firstName"
      className="adminprofile-input"
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
      className="adminprofile-input"
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
      className="adminprofile-input"
      value={updatedProfile.username }
      onChange={(e) =>
        setUpdatedProfile({ ...updatedProfile, username: e.target.value })
      }
    />
  </div>

  <div className="adminprofile-field">
    <label htmlFor="email">Email:</label>
    <input
      id="email"
      className="adminprofile-input"
      value={updatedProfile.email}
      onChange={(e) =>
        setUpdatedProfile({ ...updatedProfile, email: e.target.value })
      }
    />
  </div>

  <div className="adminprofile-field">
  <label htmlFor="password">Password:</label>
  <div className="adminpasswordDiv">
    {isEditing ? (
      <div className="adminpasDiv">
        <input
          id="password"
          type="password"
          className="adminpassword-input"
          value={tempPassword}
          placeholder="Enter new password"
          onChange={handlePasswordChange}
        />
        {tempPassword.length > 0 &&
          (tempPassword.length < 8 ? (
            <span className="adminerror-message">
              Password must be at least 8 characters long.
            </span>
          ) : (
            <span className="adminsuccess-message">Password is valid.</span>
          ))}
      </div>
    ) : (
      <p className="adminpassword-display">
        <strong>{"*".repeat(profile.password?.length || 0)}</strong>
      </p>
    )}
    <button className="admintoggle-password-button" onClick={handleToggleEdit}>
      {isEditing ? "Reset Password" : "Change Password"}
    </button>
  </div>
</div>


    <button
      className="adminprofile-button"
      onClick={() => {
        handleSave(); 
      }}
    >
Edit Profile    </button>
  </div>

</div>

<LogoutButton buttonColor="#FFFFFF" />

      </div>
    
  );
};

export default AdminProfile;
