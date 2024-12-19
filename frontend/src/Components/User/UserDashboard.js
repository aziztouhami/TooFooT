import React from "react";
import { Routes, Route } from "react-router-dom";
import UserSpace from "./UserSpace";
import Ranking from "./Ranking";
import Profile from "./Profile";
import OtherPlayerProfile from "./OtherPlayerProfile";
import Game from "./Game";

const UserDashboard = () => {
  
  return (
    <Routes>
      <Route path="/" element={<UserSpace />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/player/:id" element={<OtherPlayerProfile />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
};

export default UserDashboard;
