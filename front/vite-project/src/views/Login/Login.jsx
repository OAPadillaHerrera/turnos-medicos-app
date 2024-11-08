

import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";

function Login() {
    const { user, login } = useContext(UserContext);
    const [userData, setUserData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:3000/users/login", userData, {
                headers: { "Content-Type": "application/json" },
            });

            const data = response.data;
            if (data && data.token) {
                // Decodificar el token para obtener el ID de usuario
                const base64Url = data.token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const decodedData = JSON.parse(atob(base64));

                login({ username: userData.username, token: data.token, id: decodedData.id });
                navigate("/mis-turnos");
            } else {
                setMessage("Error en la respuesta del servidor.");
            }
        } catch (error) {
            console.log("Error en la solicitud:", error.response);
            setMessage("Error al iniciar sesión: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            navigate("/mis-turnos");
        }
    }, [user, navigate]);

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
                <input
                    type="text"
                    name="username"
                    value={userData.username}
                    placeholder="example@gmail.com"
                    onChange={handleChange}
                    required
                />
                <label>Username:</label>
            </div>
            <div>
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    placeholder="*******"
                    onChange={handleChange}
                    required
                />
                <label>Password:</label>
            </div>
            <button type="submit" disabled={!userData.username || !userData.password || loading}>
                {loading ? "Iniciando sesión..." : "Submit"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default Login;






