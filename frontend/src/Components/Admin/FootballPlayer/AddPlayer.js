import React, { useState } from "react";
import axios from "axios";

const AddPlayer = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    nicknames: "",
    niveauDifficulte: "",
    description: "",
  });

  const [imageCache, setImageCache] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "imageCache") setImageCache(files[0]);
    if (name === "image") setImage(files[0]);
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.nom) errors.nom = "Nom est requis.";
    if (!formData.prenom) errors.prenom = "Prénom est requis.";
    if (!formData.nicknames) errors.nicknames = "Surnoms sont requis.";
    if (!formData.niveauDifficulte || isNaN(formData.niveauDifficulte)) {
      errors.niveauDifficulte = "Le niveau de difficulté doit être un nombre.";
    }
    if (!imageCache) errors.imageCache = "L'image cache est requise.";
    if (!image) errors.image = "L'image est requise.";
    if (!formData.description) errors.description = "Description est requise.";
    else if (formData.description.length > 500) {
      errors.description = "Description ne doit pas dépasser 500 caractères.";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setSuccess("");

    if (!validateForm()) return;

    const data = new FormData();
    data.append("nom", formData.nom);
    data.append("prenom", formData.prenom);
    data.append("nicknames", formData.nicknames);
    data.append("niveauDifficulte", formData.niveauDifficulte);
    data.append("description", formData.description);
    data.append("imageCache", imageCache);
    data.append("image", image);

    try {
      const response = await axios.post("http://localhost:8000/api/player", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess("Le joueur a été ajouté avec succès !");
      setFormData({
        nom: "",
        prenom: "",
        nicknames: "",
        niveauDifficulte: "",
        description: "",
      });
      setImageCache(null);
      setImage(null);
    } catch (err) {
      setError({ general: "Une erreur est survenue lors de l'ajout du joueur." });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Ajouter un joueur</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error.general && <p style={{ color: "red" }}>{error.general}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.nom && <span style={{ color: "red" }}>{error.nom}</span>}
        </div>
        <div>
          <label>Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.prenom && <span style={{ color: "red" }}>{error.prenom}</span>}
        </div>
        <div>
          <label>Surnoms (séparés par des virgules) :</label>
          <input
            type="text"
            name="nicknames"
            value={formData.nicknames}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.nicknames && <span style={{ color: "red" }}>{error.nicknames}</span>}
        </div>
        <div>
          <label>Niveau de difficulté :</label>
          <input
            type="number"
            name="niveauDifficulte"
            value={formData.niveauDifficulte}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.niveauDifficulte && (
            <span style={{ color: "red" }}>{error.niveauDifficulte}</span>
          )}
        </div>
        <div>
          <label>Image Cache :</label>
          <input
            type="file"
            name="imageCache"
            onChange={handleFileChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.imageCache && <span style={{ color: "red" }}>{error.imageCache}</span>}
        </div>
        <div>
          <label>Image :</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.image && <span style={{ color: "red" }}>{error.image}</span>}
        </div>
        <div>
          <label>Description :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          ></textarea>
          {error.description && <span style={{ color: "red" }}>{error.description}</span>}
        </div>
        <button type="submit" style={{ padding: "10px 20px", background: "#007bff", color: "#fff" }}>
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddPlayer;
