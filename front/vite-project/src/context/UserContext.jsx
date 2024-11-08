

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { isCancelableDate } from '../helpers/dateValidators';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userAppointments, setUserAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Cargar usuario desde localStorage
    const loadUserFromLocalStorage = async () => {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("userID");

        if (!token || !userID) {
            setLoadingUser(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/users/${userID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser({ ...response.data, token });
            await fetchAppointments(token);
        } catch (error) {
            console.error("Error al cargar el usuario desde localStorage:", error);
            logout();
            setErrorMessage("Error al autenticar usuario.");
        } finally {
            setLoadingUser(false);
        }
    };

    // Función de inicio de sesión
    const login = ({ username, token, id }) => {
        setUser({ username, token, id });
        localStorage.setItem("token", token);
        localStorage.setItem("userID", id);
    };

    // Cargar citas del usuario
    const fetchAppointments = async (token) => {
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:3000/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserAppointments(response.data);
        } catch (error) {
            console.error("Error al cargar las citas:", error);
            setErrorMessage("No se pudieron cargar las citas.");
        }
    };

    // Función de registro
    const registerUser = async (formData) => {
        try {
            const response = await axios.post("http://localhost:3000/users/register", formData);

            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error("No se pudo registrar el usuario.");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al registrar el usuario.";
            setErrorMessage(errorMsg);
            console.error("Error al registrar el usuario:", errorMsg);
            throw error;
        }
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        setUserAppointments([]);
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        setLoadingUser(false);
    };

    // Cancelar una cita
    const cancelAppointment = async (appointmentId, appointmentDate) => {
        if (!user || !user.token) {
            setErrorMessage("No se pudo cancelar la cita: usuario no autenticado.");
            return;
        }

        if (!isCancelableDate(appointmentDate)) {
            setErrorMessage("No puedes cancelar un turno el mismo día o después de la cita.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/appointments/cancel/${appointmentId}`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (response.status === 200) {
                setUserAppointments((prevAppointments) =>
                    prevAppointments.map((appt) =>
                        appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
                    )
                );
                setErrorMessage(null);
            } else {
                setErrorMessage("No se pudo cancelar el turno: Error desconocido.");
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || "Error al cancelar el turno. Por favor, verifica la fecha o intenta de nuevo.";
            console.error("Error al cancelar el turno:", errorMsg);
            setErrorMessage(errorMsg);
        }
    };

    // Agregar una nueva cita
    const addAppointment = async (appointmentData) => {
        if (!user || !user.token || !user.id) {
            setErrorMessage("Usuario no autenticado o ID de usuario no disponible.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/appointments/schedule", {
                ...appointmentData,
                userId: user.id,
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (response.status === 201) {
                setUserAppointments((prevAppointments) => [...prevAppointments, response.data]);
                await fetchAppointments(user.token);
                return response.data;
            }
            return null;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al crear el turno.";
            setErrorMessage(errorMsg);
            console.error("Error al crear el turno:", errorMsg);
            return null;
        }
    };

    useEffect(() => {
        loadUserFromLocalStorage();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                userAppointments,
                login,
                logout,
                registerUser, // Registrar usuario agregado aquí
                cancelAppointment,
                addAppointment,
                fetchAppointments,
                errorMessage,
                setErrorMessage,
                loadingUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext };
export default UserProvider;


