import React from 'react';
import styles from './Navbar.module.css'; 

const Navbar = ({ active }) => {
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.logo}>
          <h3>ToDo</h3>
        </div>
        <ul className={styles.navigationMenu}>
          <li>
            <a href="/login" className={active === "Login" ? styles.activeNav : ""}>Login</a>
          </li>
          <li>
            <a href="/register" className={active === "Register" ? styles.activeNav : ""}>Register</a>
          </li>
          
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
