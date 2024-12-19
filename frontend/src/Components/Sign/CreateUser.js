import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateUser.css';
import logo from "../Assets/logo.png";
import { Link } from 'react-router-dom';


const CreateUser = () => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateusername = async () => {
    if (!formData.username) return;
    try {console.log(formData.username)
      await axios.post('http://localhost:8000/api/check-username', { username: formData.username });
      setErrors((prev) => ({ ...prev, username: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, username: err.response?.data?.message || 'username is already taken.' }));
    }
  };

  const validateEmail = async () => {
    if (!formData.email) return;
    try {
      
      await axios.post('http://localhost:8000/api/check-email', { email: formData.email });
      setErrors((prev) => ({ ...prev, email: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, email: err.response?.data?.message || 'Email is already taken.' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'username') validateusername();
    if (name === 'email') validateEmail();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post('http://localhost:8000/api/users', formData);
      alert(response.data.message);
      setFormData({ lastname: '', firstname: '', username: '', email: '', password: '' });
      setErrors({});
    } catch (err) {
      alert('Error creating the user. Please check all the fields.');
    }
  };

  useEffect(() => {
    const noErrors = Object.values(errors).every((error) => !error);
    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');
    setIsFormValid(noErrors && allFieldsFilled);
  }, [errors, formData]);

  return (
    <div className="create-user-container">
      <div className="photo1"></div>
      <div className="form-container1">
      <img src={logo} alt="Logo" className="Logo1" />
      <div className="form-wrapper1">
      <form onSubmit={handleSubmit } >
        <div className="form-wrapper11">
        <div className="div1">
       <div>
        <label htmlFor="firstName">First Name </label>
          <input
            type="text"
            className="input1"
            id="firstName"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div >

        <label htmlFor="lastName">Last Name </label>
          <input
            type="text"
            id="lastName"
            className="input1"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>   
        </div>

        <div className="div11">
          <label htmlFor="username">UserName</label>
          <input
            type="text"
            name="username"
            className="input1"
            id="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="div11">
        <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="input1"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="div11">
        <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="input1"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.password.length > 0 &&
            (formData.password.length < 8 ? (
              <span className="error-message">Password must be at least 8 characters long.</span>
            ) : (
              <span className="success-message">Password is valid.</span>
            ))}
        </div>

        <button
          type="submit"
          className={`submit-button ${isFormValid ? 'valid' : 'invalid'}`}
          disabled={!isFormValid}
        >
Create account        </button>
<h5 className="h51">Already have an account ? <Link to="/" className="create-account-link1">
Login
  </Link></h5>
</div>
      </form>
      </div>
      </div>
    </div>
  );
};

export default CreateUser;