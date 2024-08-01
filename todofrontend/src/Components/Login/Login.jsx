import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AuthContext from "../../AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setLoginDetails } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (username && password) {
        const response = await axios.post("http://localhost:5000/user/login", {
          username,
          password,
        });
        setLoginDetails(response.data.userWithoutPassword);
        navigate("/home");
      } else {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "Enter Username and Password",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed",
        icon: "error",
        text: error.response?.data?.message || "Server error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-text">Login</div>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      <p>If you don't have an account, please create one from the registration page.</p>
    </div>
  );
};

export default Login;
