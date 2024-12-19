import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserList.css"; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching users:", error);
        alert("Unable to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
        alert("User successfully deleted!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user.");
      }
    }
  };

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
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role.");
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="user-list-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Score</th>
            <th>Level</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{maxWidth: '3vh'}} >{user.firstname}</td>
              <td style={{maxWidth: '3vh'}} >{user.lastname}</td>
              <td style={{maxWidth: '3vh'}} >{user.username}</td>
              <td style={{maxWidth: '8vh'}} >{user.email}</td>
              <td style={{maxWidth: '1vh'}} >{user.score}</td>
              <td style={{maxWidth: '1vh'}} >{user.level ?? "-"}</td>
              <td>
              <label className="toggle-switch">
  <input
    type="checkbox"
    checked={user.role === "admin"}
    onChange={() => handleToggleRole(user._id)}
  />
  <span className="slider"></span>
</label>

              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
