

/* routes/users.ts.*/
import {Router} from 'express';
import {getUsers, getUserById, registerUser, loginUser} from '../controllers/userController';

const router: Router = Router();

/* Rutas de usuarios.*/
router.get('/', getUsers); // Obtener el listado de todos los usuarios
router.get('/:id', getUserById); // Obtener el detalle de un usuario específico
router.post('/register', registerUser); // Registro de un nuevo usuario
router.post('/login', loginUser);

export default router;


/*----------------*/

/*import { Router } from 'express';
import { createUser, getUsers, deleteUsers } from '../controllers/userController';
import auth from "../middlewares/auth';

const router: Router = Router();

// Rutas de usuarios
router.get('/users', auth, getUsers);
router.post('/users', createUser);
router.delete('/users', deleteUsers);

export default router;*/