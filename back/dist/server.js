"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users")); /* Importar el enrutador de usuarios.*/
const credentials_1 = __importDefault(require("./routes/credentials")); /* Importar el enrutador de credenciales.*/
const appointments_1 = __importDefault(require("./routes/appointments")); /* Importar el enrutador de turnos.*/
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
server.use((0, morgan_1.default)("dev"));
/* Middleware para parsear JSON.*/
server.use(express_1.default.json());
server.use((0, cors_1.default)());
/* Usar las rutas de usuarios bajo la ruta "/users".*/
server.use('/users', users_1.default);
/* Usar las rutas de turnos bajo la ruta "/appointments".*/
server.use('/appointments', appointments_1.default);
/* Usar las rutas de turnos bajo la ruta "/credentials".*/
server.use('/credentials', credentials_1.default);
/* Middleware para manejar rutas no encontradas (404).*/
server.use((req, res, next) => {
    res.status(404).json({ message: 'RUTA NO ENCONTRADA.' });
});
// Middleware general de manejo de errores
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'OCURRIÓ UN ERROR EN EL SERVIDOR.' });
});
exports.default = server;


/*----------------------------*/

/*import express from "express";
import router from "./routes";

const server = express ();
server.use (express.json ());

server.use (router);

export default server;*/
