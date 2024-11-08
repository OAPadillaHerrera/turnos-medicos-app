

import { Router } from 'express';
import { getAppointments, getAppointmentById, scheduleAppointment, cancelAppointment } from '../controllers/appointmentController';
import auth from '../middlewares/auth';

const router: Router = Router();

/* Obtener el listado de todos los turnos del usuario logueado */
router.get('/', auth, getAppointments);

/* Obtener el detalle de un turno específico */
router.get('/:id', auth, getAppointmentById);

/* Agendar un nuevo turno */
router.post('/schedule', auth, scheduleAppointment);

/* Cambiar el estatus de un turno a "cancelled" */
router.put('/cancel/:id', auth, cancelAppointment);

export default router;
