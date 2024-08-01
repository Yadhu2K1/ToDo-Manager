import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import AuthContext from "./AuthContext";
import CreateProject from "./Components/CreateProject/CreateProject";
import Todo from "./Components/Todo/Todo";
import CreateTodo from "./Components/CreateTodo/CreateTodo";
import Welcome from "./Components/Welcome/Welcome";
import Register from "./Components/Register/Register";

const App = () => {
  const [loginDetails, setLoginDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);

  const value = {
    projectDetails,
    setProjectDetails,
    loginDetails,
    setLoginDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={loginDetails ? <Home /> : <Navigate to="/login" />} />
          <Route path="/create-project" element={loginDetails ? <CreateProject /> : <Navigate to="/login" />} />
          <Route path="/todo" element={loginDetails ? <Todo /> : <Navigate to="/login" />} />
          <Route path="/create-todo" element={loginDetails ? <CreateTodo /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
