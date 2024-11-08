

// src/components/turno.jsx
import React from 'react';

const SingleTurno = ({ id, date, time, status, description, onCancel }) => {
  return (
    <div className="card">
      <h2>Turno #{id}</h2>
      <p><strong>Descripción:</strong> {description}</p>
      <p><strong>Fecha:</strong> {date}</p>
      <p><strong>Hora:</strong> {time}</p>
      <p><strong>Estado:</strong> {status}</p>
      
      {/* Solo mostramos el botón Cancelar si el estado es "Active" */}
      {status === "active" && (
        <button onClick={onCancel} className="cancel-button" disabled={status === "cancelled"}>
          Cancelar
        </button>
      )}
    </div>
  );
};

export default SingleTurno;


