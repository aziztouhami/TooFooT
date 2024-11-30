import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ identifier: "", password: "" }); // Réinitialiser les erreurs

    try {
      const response = await axios.post("http://localhost:8000/api/signin", { identifier, password });
      const { user, token } = response.data;

      // Stocker le token dans le localStorage ou autre si nécessaire
      localStorage.setItem("token", token);

      // Rediriger selon le rôle de l'utilisateur
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "user") {
        navigate("/user");
      }
    } catch (err) {
      // Gérer les erreurs
      if (err.response?.data?.msg === "Mot de passe incorrect") {
        setError((prevError) => ({ ...prevError, password: "Mot de passe incorrect" }));
      } else if (err.response?.data?.msg === "Utilisateur non enregistré") {
        setError((prevError) => ({ ...prevError, identifier: "Identifiant non existant" }));
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        {/* Champ Identifiant */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="identifier">Pseudo ou Email :</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              border: error.identifier ? "2px solid red" : "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          {error.identifier && <span style={{ color: "red", fontSize: "12px" }}>{error.identifier}</span>}
        </div>

        {/* Champ Mot de passe */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              border: error.password ? "2px solid red" : "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          {error.password && <span style={{ color: "red", fontSize: "12px" }}>{error.password}</span>}
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Connexion
        </button>
      </form>
    </div>
  );
};

export default SignIn;
