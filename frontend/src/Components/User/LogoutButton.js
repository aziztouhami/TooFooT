import React from "react";
import { useNavigate } from "react-router-dom"; 
import logout from "../Assets/Log out.png"; 
import logout2 from "../Assets/Log out2.png"; 
import "./LogoutButton.css"; 

const LogoutButton = ({ buttonColor }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  return (
    
    <button
      className="logout-btn"
      onClick={handleLogout}  
      style={{ color: buttonColor }} 
    >
        {buttonColor.toUpperCase()=='#FFFFFF' ?
      <img src={logout} alt="Logout Icon" className="logout-icon" />: <img src={logout2} alt="Logout Icon" className="logout-icon" />}
      <p className="logout-text">Log out</p>
    </button>
  );
};



export default LogoutButton;
