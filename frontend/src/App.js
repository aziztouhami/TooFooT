import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Components/Sign/SignIn";
import CreateUser from "./Components/Sign/CreateUser";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserRole from "./Components/Sign/UserRole";
import UserDashboard from "./Components/User/UserDashboard";
const App = () => {
  const role = UserRole(); 
console.log(role)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/" element={<SignIn />} />

        <Route path="/user/*" element={role == "user" ? <UserDashboard /> : <Navigate to="/"  /> }
        />

        <Route  path="/admin/*" element={  role == "admin" ? <AdminDashboard /> : <Navigate to="/" />  }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
