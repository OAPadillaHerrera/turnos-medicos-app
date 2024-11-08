

// MisTurnos.js
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SingleTurno from "../components/turno";

const MisTurnos = () => {
    const {
        user,
        userAppointments,
        cancelAppointment,
        fetchAppointments,
        errorMessage,
        setErrorMessage,
        loadingUser,
    } = useUserContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !localStorage.getItem("token")) {
            navigate("/");
        } else {
            setLoading(false);
            fetchAppointments(user.token);
        }
    }, [user, navigate]);

    const handleCancelAppointment = async (appointmentId, appointmentDate) => {
        await cancelAppointment(appointmentId, appointmentDate);
    };

    return (
        <div className="mis-turnos-container">
            <h2>Mis Turnos</h2>

            {/* Mostrar el mensaje de error si existe */}
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            {loadingUser || loading ? (
                <p>Cargando tus turnos...</p>
            ) : userAppointments.length === 0 ? (
                <p>No tienes turnos programados.</p>
            ) : (
                <div className="turnos-list">
                    {userAppointments.map((turno) => (
                        <SingleTurno
                            key={turno.id}
                            id={turno.id}
                            date={turno.date}
                            time={turno.time}
                            status={turno.status}
                            description={turno.description}
                            onCancel={() => handleCancelAppointment(turno.id, turno.date)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisTurnos;














