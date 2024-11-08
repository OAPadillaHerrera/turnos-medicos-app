"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.getUserById = exports.getUsers = void 0;
const usersService_1 = require("../services/usersService");
const usersService_2 = require("../services/usersService");
/* FUNCIÓN PARA OBTENER TODOS LOS USUARIOS: */
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* const users = await db.query('SELECT * FROM users');*/
        const users = yield (0, usersService_1.obtenerUsuarios)(); /* Llamamos al servicio que usa el DTO y el bucle for.*/
        /* Eliminar el campo credentialsId de cada usuario antes de enviarlo.*/
        const usersWithoutCredentialsId = users.map((_a) => {
            var { credentialsId } = _a, rest = __rest(_a, ["credentialsId"]);
            return rest;
        });
        res.json(usersWithoutCredentialsId); /* Enviamos la respuesta como JSON.*/
    }
    catch (error) {
        console.error('ERROR AL OBTENER LOS USUARIOS:', error);
        res.status(500).send('NO SE PUDO OBTENER EL LISTADO DE USUARIOS');
    }
});
exports.getUsers = getUsers;
/* FUNCIÓN PARA OBTENER UN USUARIO POR ID: */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);*/
        const userId = parseInt(req.params.id); /*Convertimos el parámetro a número.*/
        const user = yield (0, usersService_1.obtenerUsuario)(userId); /* Llamamos al servicio que usa el bucle for.*/
        if (user) {
            const { username, password, credentialsId } = user, userWithoutSensitiveData = __rest(user, ["username", "password", "credentialsId"]);
            res.json(userWithoutSensitiveData); /* // Enviar la respuesta sin 'username', 'password' ni 'credentialsId'.*/
        }
        else {
            res.status(404).send(`NO SE ENCONTRÓ USUARIO CON ID ${userId}.`);
        }
    }
    catch (error) {
        console.error(`ERROR AL OBTENER EL USUARIO CON ID ${req.params.id}:`, error);
        res.status(500).send('NO SE PUDO OBTENER LA INFORMACIÓN DEL USUARIO.');
    }
});
exports.getUserById = getUserById;
/* FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO: */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, birthdate, nDni, username, password } = req.body; /* Obtenemos los datos del cuerpo de la petición.*/
        /* Validación de campos obligatorios.*/
        if (!name || !email || !birthdate || !nDni || !username || !password) {
            res.status(400).json({ message: 'FALTAN CAMPOS OBLIGATORIOS.' }); /* Enviar código 400 si falta algún campo.*/
            return; /* Detener la ejecución si faltan campos: AGREGADO!*/
        }
        /* Validación de datos incorrectos. */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar email
        const dniRegex = /^\d{8}$/; // Ahora valida que sean exactamente 8 números.; 
        const minPasswordLength = 6;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'El formato del correo electrónico es incorrecto.' });
            return;
        }
        const birthDateObj = new Date(birthdate);
        if (isNaN(birthDateObj.getTime())) {
            res.status(400).json({ message: 'La fecha de nacimiento es incorrecta.' });
            return;
        }
        if (!dniRegex.test(nDni)) {
            res.status(400).json({ message: 'El formato del DNI es incorrecto.' });
            return;
        }
        if (password.length < minPasswordLength) {
            res.status(400).json({ message: `La contraseña debe tener al menos ${minPasswordLength} caracteres.` });
            return;
        }
        const newUser = yield (0, usersService_1.crearUsuario)(name, email, new Date(birthdate), nDni, username, password); /* Llamamos al servicio.*/
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('ERROR AL REGISTRAR EL USUARIO.', error);
        res.status(500).send('NO SE PUDO REGISTRAR EL USUARIO.');
    }
});
exports.registerUser = registerUser;
/* FUNCIÓN PARA INICIAR SESIÓN EN EL CONTROLADOR */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Faltan campos obligatorios.' });
            return;
        }
        const result = yield (0, usersService_2.loginUsuario)(username, password);
        if (!result) {
            res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
            return;
        }
        const { user, token } = result;
        // Excluimos los campos sensibles antes de enviar al frontend
        const { password: _, username: __, credentialsId: ___ } = user, userResponse = __rest(user, ["password", "username", "credentialsId"]);
        // Devolvemos el token y los datos del usuario
        res.status(200).json({
            login: true,
            user: userResponse,
            token: token
        });
    }
    catch (error) {
        console.error('ERROR AL INICIAR SESIÓN:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});
exports.loginUser = loginUser;
