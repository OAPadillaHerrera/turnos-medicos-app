"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controllers/appointmentController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
/* Obtener el listado de todos los turnos del usuario logueado */
router.get('/', auth_1.default, appointmentController_1.getAppointments);
/* Obtener el detalle de un turno específico */
router.get('/:id', auth_1.default, appointmentController_1.getAppointmentById);
/* Agendar un nuevo turno */
router.post('/schedule', auth_1.default, appointmentController_1.scheduleAppointment);
/* Cambiar el estatus de un turno a "cancelled" */
router.put('/cancel/:id', auth_1.default, appointmentController_1.cancelAppointment);
exports.default = router;
