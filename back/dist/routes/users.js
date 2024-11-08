"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* routes/users.ts.*/
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
/* Rutas de usuarios.*/
router.get('/', userController_1.getUsers); // Obtener el listado de todos los usuarios
router.get('/:id', userController_1.getUserById); // Obtener el detalle de un usuario específico
router.post('/register', userController_1.registerUser); // Registro de un nuevo usuario
router.post('/login', userController_1.loginUser);
exports.default = router;


/*---------------------*/

/*import { Router } from 'express';
import { createUser, getUsers, deleteUsers } from '../controllers/userController';
import auth from "../middlewares/auth';

const router: Router = Router();

// Rutas de usuarios
router.get('/users', auth, getUsers);
router.post('/users', createUser);
router.delete('/users', deleteUsers);

export default router;*/ 
