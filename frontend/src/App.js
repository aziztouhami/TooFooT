import React from "react";
import { BrowserRouter , Routes, Route,  } from "react-router-dom";
import SignIn from "./Components/Sign/SignIn";
import PlayerList from "./Components/Admin/FootballPlayer/PlayerList";
import AddPlayer from "./Components/Admin/FootballPlayer/AddPlayer";
import EditPlayer from "./Components/Admin/FootballPlayer/EditPlayer";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserList from "./Components/Admin/Users/UserList";
import UserSpace from "./Components/User/UserSpace";
import Ranking from "./Components/User/Ranking";
import Profile from "./Components/User/Profile";
import OtherPlayerProfile from "./Components/User/OtherPlayerProfile";
import Game from "./Components/User/Game";
import CreateUser from "./Components/Sign/CreateUser";





const App = () => {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/a" element={<CreateUser />} />

        <Route path="/" element={<SignIn />} />
        <Route
          path="/user"
          element={ <UserSpace />}
        />
         <Route path="/ranking" element={<Ranking />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/player/:id" element={<OtherPlayerProfile />} />
         <Route path="/game" element={<Game />} />


        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/add-player"
          element={<AddPlayer />}
        />
        <Route
          path="/player-list"
          element={<PlayerList />}
        />
        <Route
          path="/user-list"
          element={<UserList />}
        />
                <Route path="/edit-player/:id" element={<EditPlayer />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;

