

import {Router} from 'express';
import {createCredential, validateCredential} from '../controllers/credentialController';

const router: Router = Router ();

/* Rutas de credenciales. */
router.post('/create', createCredential); // Crear una nueva credencial
router.post('/validate', validateCredential); // Validar una credencial

export default router;