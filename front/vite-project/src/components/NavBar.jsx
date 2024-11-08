

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './NavBar.css';

const NavBar = () => {
    const { user, logout } = useContext(UserContext);

    return (
        <nav className="nav-bar">
            <Link to="/home">Home</Link>
            <Link to="/mis-turnos"> My Appointments</Link>
            {user && <Link to="/create-appointment">Crear Turno</Link>} {/* Nuevo enlace condicional */}
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>

            {user ? (
                <>
                    <span>Bienvenido, {user.username}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;




