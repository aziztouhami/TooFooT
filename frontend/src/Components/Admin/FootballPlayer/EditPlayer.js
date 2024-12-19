import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './EditPlayer.css';
import returnAdd from '../../Assets/Return.png'

const EditPlayer = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    nicknames: "",
    difficultyLevel: "",
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
        console.error("Error fetching player:", error);
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
    const { name, files } = e.target;
    console.log(name, e.target.files[0]);
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
      console.error("Error updating player:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-space">
                   <button className="return-edit" onClick={()=>navigate('/admin')}> <img src={returnAdd} alt="Player" className="edit-return-img" /></button>
      
      <h2 className="edit-title">Edit Player</h2>
      <div className="edit-container">
      
      <div className="edit-fields">
      <form onSubmit={handleSubmit} classname="form-edit">
      <div className="div6">
        <div>
        <label>
          First Name:
          </label>
          <input
            type="text"
            name="firstname"
            className="edit-input"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
          
        
        </div>
        <div>
        <label>
          Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="edit-input"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        
        </div>
        </div>
        <div>
        <label>
          Nicknames:</label>
          <input
            type="text"
            name="nicknames"
            className="edit-input"
            value={formData.nicknames}
            onChange={handleInputChange}
          />
        </div>
        <div>
        <label>
          Description:</label>
          <textarea
            name="description"
            className="edit-input"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        {player && (
                <div className="div6">

            <div>
              <h3>Current Image:</h3>
              <img
                src={`http://localhost:8000/uploads/${player.image}`}
                alt="Player image"
                style={{width: '20vh', height: '18vh', objectFit: 'contain' }}
              />
            </div>
            <div>
              <h3>Current Cached Image:</h3>
              <img
                src={`http://localhost:8000/uploads/${player.imageCache}`}
                alt="Player cached image"
                style={{width: '20vh', height: '18vh', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}
                        <div className="div6">

<div>
        <label>
          Image:</label>
          <input type="file" name="image" onChange={handleFileChange} /></div>
          <div>
        <label>

          Cached Image:</label>
          <input type="file" name="imageCache" onChange={handleFileChange} />
          </div>          </div>

        

        <button type="submit" className="edit-submit">
          Save Changes
        </button>
      </form>
      </div>
      </div>
    </div>
  );
};

export default EditPlayer;
