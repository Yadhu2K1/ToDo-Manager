import React from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import LandingImage from '../../images/Landing.png'; 
import './welcome.css'; 

const Welcome = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <Navbar active="Home" />
      <div className="welcome__wrapper">
        <div className="welcome__text">
          <h1>Your Tasks, Your Way <br/><span className="PrimaryText">Let's Get It Done!</span></h1>
          <div className="Btnwrapper">
            <button className="primaryBtn" onClick={handleCreateAccount}>
              Register
            </button>
            <button className="secondaryBtn" onClick={handleLogin}>
              Login
            </button>
          </div>
          <p className="welcome__info">If you are new, please register first.</p> 
        </div>
        <div className="welcome__image">
          <img src={LandingImage} alt="Welcome" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
