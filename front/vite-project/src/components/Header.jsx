

/// Header.jsx
import React from "react";
import logo from '../assets/imagenes/cita-medica.png'; // Ajusta la ruta según el nombre y extensión de tu archivo
import '../App.css';

const Header = () => {
    return (
        <header className="app-header">
            <img src={logo} alt="Logo" className="header-logo" />
            <div className="header-text">
                <h1 className="header-title"> DigiApp</h1>
            </div>
        </header>
    );
};

export default Header;


