

import { Router } from 'express';
import userRoutes from './users';
import appointmentRoutes from './appointments';
import credentialRoutes from './credentials';


const router: Router = Router();

/* Usar las rutas de "users" bajo la ruta "/users".*/
router.use('/users', userRoutes);

/* Usar las rutas de "appointments" bajo la ruta "/appointments".*/
router.use('/appointments', appointmentRoutes);

/* Usar las rutas de "appointments" bajo la ruta "/appointments".*/
router.use('/credentials', credentialRoutes);

export default router;


/*------------------*/

/*import { Router } from "express";
import { createUser, getUsers, deleteUsers } from "../controllers/userController";
import auth from "../midllewares/auth";

const router: Router = Router ();

router.get ("/users", auth, getUsers);
router.post ("/users", createUser);
router.delete ("/users", deleteUsers);

export default router;*/
 
