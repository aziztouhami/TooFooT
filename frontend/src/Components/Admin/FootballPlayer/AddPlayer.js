import React, { useState } from "react";
import axios from "axios";
import './AddPlayer.css';
import playerImage from '../../Assets/Other Player.png'
import returnAdd from '../../Assets/Return.png'
import { Navigate, useNavigate } from "react-router-dom";


const AddPlayer = () => {
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    nicknames: "",
    difficultyLevel: "",
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
    if (!formData.lastname) errors.lastname = "Last name is required.";
    if (!formData.firstname) errors.firstname = "First name is required.";
    if (!formData.nicknames) errors.nicknames = "Nicknames are required.";
    if (!formData.difficultyLevel || isNaN(formData.difficultyLevel)) {
      errors.difficultyLevel = "Difficulty level must be a number.";
    }
    if (!imageCache) errors.imageCache = "Image cache is required.";
    if (!image) errors.image = "Image is required.";
    if (!formData.description) errors.description = "Description is required.";
    else if (formData.description.length > 500) {
      errors.description = "Description must not exceed 500 characters.";
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
    data.append("lastname", formData.lastname);
    data.append("firstname", formData.firstname);
    data.append("nicknames", formData.nicknames);
    data.append("difficultylevel", formData.difficultyLevel);
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
      setSuccess("Player added successfully!");
      setFormData({
        lastname: "",
        firstname: "",
        nicknames: "",
        difficultyLevel: "",
        description: "",
      });
      setImageCache(null);
      setImage(null);
    } catch (err) {
      setError({ general: "An error occurred while adding the player." });
    }
  };

  return (
    <div className="add-space">
             <button className="return-add" onClick={()=>navigate('/admin')}> <img src={returnAdd} alt="Player" className="add-return-img" /></button>

      <h2 className="add-title">Add a Player</h2>
      
      <div className="add-container">
      
      <div className="add-fields">
        <img src={playerImage} alt="Player" className="add-player-img" />
        
      <form className="form-add" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="div5">
      <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            className="add-input"
            value={formData.firstname}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.firstname && <span style={{ color: "red" ,marginTop:'-1vh'}}>{error.firstname}</span>}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="add-input"
            value={formData.lastname}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.lastname && <span style={{ color: "red",marginTop:'-1vh' }}>{error.lastname}</span>}
        </div>
        
        </div>
        <div>
          <label>Nicknames (separated by commas):</label>
          <input
            type="text"
            name="nicknames"
            className="add-input"
            value={formData.nicknames}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.nicknames && <span style={{ color: "red",marginTop:'-1vh' }}>{error.nicknames}</span>}
        </div>
        <div>
          <label>Difficulty Level:</label>
          <input
            type="number"
            name="difficultyLevel"
            className="add-input"

            value={formData.difficultyLevel}
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.difficultyLevel && (
            <span style={{ color: "red",marginTop:'-1vh' }}>{error.difficultyLevel}</span>
          )}
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            className="add-input"
            onChange={handleChange}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          ></textarea>
          {error.description && <span style={{ color: "red",marginTop:'-1vh' }}>{error.description}</span>}
        </div>
        <div className="div5">
        <div>
          <label>Image Cache:</label>
          <input
            type="file"
            name="imageCache"
            onChange={handleFileChange}
            style={{ display: "block",marginBottom: "10px" }}
          />
          {error.imageCache && <span style={{ color: "red",marginTop:'-1vh' }}>{error.imageCache}</span>}
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {error.image && <span style={{ color: "red" ,marginTop:'-1vh'}}>{error.image}</span>}
        </div>
        </div>
        
        <button type="submit" className="add-submit">
          Add
        </button>
        {success && <p style={{ color: "green" ,marginLeft:'17vh'}}>{success}</p>}
      {error.general && <p style={{ color: "red",marginLeft:'17vh' }}>{error.general}</p>}
      </form>
      </div>

      </div>
    </div>
  );
};

export default AddPlayer;
