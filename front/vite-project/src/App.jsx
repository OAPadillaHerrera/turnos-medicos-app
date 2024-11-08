

import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Home from './views/Home';
import MisTurnos from './views/MisTurnos';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import CreateAppointment from './views/CreateAppointmentForm.jsx'; // Importa el componente de creación de turnos
import ProtectedRoute from "./ProtectedRoute"; 
import './App.css';

function App() {
    const { user, loadingUser } = useContext(UserContext);

    useEffect(() => {
        console.log("Usuario en contexto:", user);
    }, [user]);

    // Muestra un indicador de carga mientras `loadingUser` está en true
    if (loadingUser) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <NavBar />
            <Routes>
                {/* Redirige a /mis-turnos si el usuario está logueado, o a /login si no lo está */}
                <Route path="/" element={user ? <Navigate to="/mis-turnos" /> : <Navigate to="/home" />} />
                
                {/* Ruta para registrar y loguearse */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Ruta protegida para la vista de mis turnos */}
                <Route 
                    path="/mis-turnos" 
                    element={
                        /*<ProtectedRoute>*/
                            <MisTurnos />
                        /*</ProtectedRoute>*/
                    } 
                />
                
                {/* Ruta protegida para crear un turno */}
                <Route 
                    path="/create-appointment" 
                    element={
                        <ProtectedRoute>
                            <CreateAppointment />
                        </ProtectedRoute>
                    }
                />
                
                {/* Ruta para la vista de inicio */}
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;

