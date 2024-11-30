import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    nom: '',
    prenom: '',
    email: '',
    pseudo: '',
    classement: 0,
    niveau: 0,
  });

  const [editableField, setEditableField] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (field) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8000/api/profile',
        { [field]: updatedValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prev) => ({ ...prev, [field]: updatedValue }));
      setEditableField('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Profil</h2>
      {Object.keys(profile).map((key) => (
        key !== 'classement' && key !== 'niveau' ? (
          <div key={key} style={{ marginBottom: '10px' }}>
            <span>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {editableField === key ? (
                <input
                  value={updatedValue}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                />
              ) : (
                profile[key]
              )}
            </span>
            {editableField === key ? (
              <button onClick={() => handleUpdate(key)}>Save</button>
            ) : (
              <button onClick={() => {
                setEditableField(key);
                setUpdatedValue(profile[key]);
              }}>
                Modifier
              </button>
            )}
          </div>
        ) : (
          <div key={key} style={{ marginBottom: '10px' }}>
            <span>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {profile[key]}
            </span>
          </div>
        )
      ))}
      <button
        style={{ marginTop: '20px', padding: '10px 20px', background: 'blue', color: 'white' }}
        onClick={() => console.log('Change Password')}
      >
        Changer le mot de passe
      </button>
    </div>
  );
};

export default Profile;
