import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer la liste des utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        alert("Impossible de récupérer les utilisateurs.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
        alert("Utilisateur supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        alert("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  // Changer le rôle d'un utilisateur
  const handleToggleRole = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/user/role/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = response.data.user;
      setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
      alert("Rôle mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      alert("Erreur lors de la mise à jour du rôle.");
    }
  };

  if (loading) {
    return <p>Chargement des utilisateurs...</p>;
  }

  return (
    <div>
      <h1>Gestion des Utilisateurs</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Pseudo</th>
            <th>Email</th>
            <th>Score</th>
            <th>Classement</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.pseudo}</td>
              <td>{user.email}</td>
              <td>{user.score}</td>
              <td><td>{user.classement ?? "-"}</td>
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={user.role === "admin"}
                    onChange={() => handleToggleRole(user._id)}
                  />
                  {user.role === "admin" ? "Admin" : "Utilisateur"}
                </label>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
