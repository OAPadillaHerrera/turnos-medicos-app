"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const appointments_1 = __importDefault(require("./appointments"));
const credentials_1 = __importDefault(require("./credentials"));
const router = (0, express_1.Router)();
/* Usar las rutas de "users" bajo la ruta "/users".*/
router.use('/users', users_1.default);
/* Usar las rutas de "appointments" bajo la ruta "/appointments".*/
router.use('/appointments', appointments_1.default);
/* Usar las rutas de "appointments" bajo la ruta "/appointments".*/
router.use('/credentials', credentials_1.default);
exports.default = router;


/*---------------------*/

/*import { Router } from "express";
import { createUser, getUsers, deleteUsers } from "../controllers/userController";
import auth from "../midllewares/auth";

const router: Router = Router ();

router.get ("/users", auth, getUsers);
router.post ("/users", createUser);
router.delete ("/users", deleteUsers);

export default router;*/
