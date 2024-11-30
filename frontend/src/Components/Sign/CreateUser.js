import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    pseudo: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // État du bouton Submit

  // Fonction pour vérifier si le champ pseudo est disponible
  const validatePseudo = async () => {
    if (!formData.pseudo) return;
    try {
      await axios.post('http://localhost:8000/api/check-pseudo', { pseudo: formData.pseudo });
      setErrors((prev) => ({ ...prev, pseudo: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, pseudo: err.response?.data?.message || 'Erreur avec le pseudo.' }));
    }
  };

  // Fonction pour vérifier si l'email est disponible
  const validateEmail = async () => {
    if (!formData.email) return;
    try {
      await axios.post('http://localhost:8000/api/check-email', { email: formData.email });
      setErrors((prev) => ({ ...prev, email: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, email: err.response?.data?.message || 'Erreur avec l\'email.' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' })); // Réinitialise l'erreur du champ
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'pseudo') validatePseudo();
    if (name === 'email') validateEmail();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users', formData);
      alert(response.data.message);
      setFormData({ nom: '', prenom: '', pseudo: '', email: '', password: '' });
      setErrors({});
    } catch (err) {
      alert('Erreur lors de la création de l’utilisateur, Vérifie tout les fields');
    }
  };

  useEffect(() => {
    // Vérifie si tous les champs sont valides
    const noErrors = Object.values(errors).every((error) => !error);
    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');
    setIsFormValid(noErrors && allFieldsFilled);
  }, [errors, formData]);

  return (
    <div>
      <h1>Créer un nouvel utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="pseudo"
            placeholder="Pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.pseudo && <p style={{ color: 'red' }}>{errors.pseudo}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.password.length > 0 &&
            (formData.password.length < 8 ? (
              <p style={{ color: 'red' }}>Le mot de passe doit contenir au moins 8 caractères.</p>
            ) : (
              <p style={{ color: 'green' }}>Mot de passe valide.</p>
            ))}
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: isFormValid ? 'green' : 'red',
            color: 'white',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
          }}
          disabled={!isFormValid}
        >
          Créer
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
