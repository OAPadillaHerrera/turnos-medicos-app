

import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { isWeekend, isWithinWorkingHours } from '../helpers/dateValidators'; // Funciones de validación que vamos a definir



// Función para convertir hora AM/PM a formato 24 horas
const convertTo24HourFormat = (time12h) => {
    let [hours, minutes] = time12h.split(":");
    const ampm = minutes.slice(-2).toUpperCase(); // Obtener AM/PM
    minutes = minutes.slice(0, 2); // Obtener solo los minutos

    hours = parseInt(hours); // Convertir horas a número

    if (ampm === "AM" && hours === 12) {
        hours = 0; // 12 AM es igual a 00 en formato 24 horas
    } else if (ampm === "PM" && hours !== 12) {
        hours += 12; // Sumar 12 para convertir a formato 24 horas
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

const CreateAppointment = () => {
    const { user, addAppointment } = useContext(UserContext);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState(''); // Hora en formato AM/PM
    const [createdAppointment, setCreatedAppointment] = useState(null);
    const navigate = useNavigate();

    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validar si el usuario está autenticado
        if (!user || !user.id) {
            alert("Debes estar logueado para crear un turno.");
            navigate('/login');
            return;
        }      
        
        // Verificar si la fecha seleccionada es un fin de semana
        if (isWeekend(date)) {
            alert("No se pueden agendar turnos los fines de semana. Por favor, elige otra fecha.");
            return; // Detener la ejecución si es fin de semana
        }
        
        // Comprobar qué valor tiene `time` antes de la conversión
        console.log("Hora original del formulario:", time);
        
        // Convertir la hora al formato de 24 horas
        const time24 = convertTo24HourFormat(time);
        
        // Comprobar el valor después de la conversión
        console.log("Hora convertida a 24 horas:", time24);
        
        // Verificar si la hora seleccionada está dentro del horario laboral
        if (!isWithinWorkingHours(time24)) {
            console.log("Hora fuera del horario laboral:", time24);
            alert("La hora seleccionada no está dentro del horario laboral (9:00 - 16:00). Por favor, elige otra hora.");
            return; // Detener la ejecución si está fuera del horario laboral
        } else {
            console.log("Hora dentro del horario laboral:", time24);
        }
        
        // Proceder con el resto del código
        try {
            const selectedDate = new Date(date);
            const formattedDate = selectedDate.toISOString().split('T')[0];
        
            const newAppointment = {
                description,
                date: formattedDate,
                time: time24, 
                userId: user.id,
            };
        
            console.log("Datos enviados al backend:", newAppointment);
        
            const result = await addAppointment(newAppointment);
            if (result) {
                setCreatedAppointment({ ...result, status: 'active' });
                alert("Turno creado exitosamente.");
        
                setDescription('');
                setDate('');
                setTime('');
            } else {
                alert("Error al crear el turno. Intenta de nuevo.");
            }
        } catch (error) {
                console.error("Error al crear el turno:", error);
        }
    };
    
    return (
        <div>
            <h2>Crear Nuevo Turno</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Descripción:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hora (AM/PM):</label>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Ej: 02:30 PM"
                        required
                    />
                </div>
                <button type="submit">Crear Turno</button>
            </form>

            {createdAppointment && createdAppointment.description && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <h3>Turno Creado:</h3>
                    <p><strong>Descripción:</strong> {createdAppointment.description}</p>
                    <p><strong>Fecha y Hora:</strong> {createdAppointment.date}</p>
                    <p><strong>Estado:</strong> {createdAppointment.status}</p>
                </div>
            )}
        </div>
    );
};

export default CreateAppointment;



