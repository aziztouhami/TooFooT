import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './EditPlayer.css';

const EditPlayer = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    nicknames: "",
    niveauDifficulte: "",
    description: "",
    image: null,
    imageCache: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/api/player/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayer(response.data);
        setFormData({
          ...response.data,
          nicknames: response.data.nicknames.join(", "),
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du joueur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  

  const handleFileChange = (e) => {
    const { name,files } = e.target;
    console.log(name,e.target.files[0])
    setFormData((prevData) => ({ ...prevData, [name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
  
      Object.keys(formData).forEach((key) => {
        if (key === "image" || key === "imageCache") {
          if (formData[key]) {
            form.append(key, formData[key]);
          }
        } else {
          form.append(key, formData[key]);
        }
      });
  
      await axios.patch(`http://localhost:8000/api/player/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      navigate("/admin");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du joueur :", error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="edit-player-container">
      <h2>Modifier le joueur</h2>
      <form onSubmit={handleSubmit} className="edit-player-form">
        <label>
          Nom:
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Prénom:
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Nicknames:
          <input
            type="text"
            name="nicknames"
            value={formData.nicknames}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        
        {/* Affichage des images existantes */}
        {player && (
          <>
            <div>
              <h3>Image actuelle:</h3>
              <img src={`http://localhost:8000/uploads/${player.image}`} alt="Image du joueur" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </div>
            <div>
              <h3>Image Cache actuelle:</h3>
              <img src={`http://localhost:8000/uploads/${player.imageCache}`} alt="Image cache du joueur" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </div>
          </>
        )}

        <label>
          Image:
          <input type="file" name="image" onChange={handleFileChange} />
        </label>
        <label>
          Image Cache:
          <input type="file" name="imageCache" onChange={handleFileChange} />
        </label>
        
        <button type="submit" className="submit-button">Enregistrer les modifications</button>
      </form>
    </div>
  );
};

export default EditPlayer;