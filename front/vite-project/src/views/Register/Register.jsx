

import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { registerUser } = useContext(UserContext); // Obtenemos la función registerUser del contexto
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        birthdate: "",
        nDni: "",
        username: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const isFormValid = () => {
        const { email, name, password, birthdate, nDni, username } = form;
        return email && name && password && birthdate && nDni && username;
    };

  // Register.js
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
        setMessage("Por favor, completa todos los campos.");
        return;
    }

    console.log("Datos del formulario:", form);
    setLoading(true);

    try {
        await registerUser(form); // Solo llamamos a registerUser sin guardar el token

        // Redirige al usuario a la página de login tras el registro exitoso
        navigate("/login");
        setMessage("Registro exitoso. Por favor, inicia sesión.");
    } catch (error) {
        console.error("Error al registrar el usuario:", error.response || error.message);
        setMessage(`Error al registrar el usuario: ${error.response?.data?.message || error.message}`);
    } finally {
        setLoading(false);
    }
};

    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                        required
                    />
                    <label> e-mail:</label>
                </div>
                <div>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        placeholder="Nombre Completo"
                        onChange={handleChange}
                        required
                    />
                    <label>Name:</label>
                </div>
                <div>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        placeholder="Nombre de Usuario"
                        onChange={handleChange}
                        required
                    />
                    <label>Username:</label>
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />
                    <label>Password:</label>
                </div>
                <div>
                    <input
                        type="date"
                        name="birthdate"
                        value={form.birthdate}
                        onChange={handleChange}
                        required
                    />
                    <label>Birthdate:</label>
                </div>
                <div>
                    <input
                        type="number"
                        name="nDni"
                        value={form.nDni}
                        placeholder="Número de DNI"
                        onChange={handleChange}
                        required
                    />
                    <label>DNI:</label>
                </div>

                <button type="submit" disabled={!isFormValid() || loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>

                {/* Mostrar mensaje de error si existe */}
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Register;









