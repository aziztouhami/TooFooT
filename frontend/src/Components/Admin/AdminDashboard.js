import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/add-player">Add Player</Link>
          </li>
          <li>
            <Link to="/player-list">View Players</Link>
          </li>
          <li>
            <Link to="/user-list">Manage Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
