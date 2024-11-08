

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.scheduleAppointment = exports.getAppointmentById = exports.getAppointments = void 0;
const appDataSource_1 = require("../config/appDataSource");
const Appointments_1 = require("../entities/Appointments");
const Users_1 = require("../entities/Users");
/* OBTENER LOS TURNOS DEL USUARIO LOGUEADO */
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
        const appointments = yield appointmentRepository.find({
            relations: ['user'],
            where: { user: { id: userId } },
        });
        res.status(200).json(appointments);
    }
    catch (error) {
        console.error('ERROR AL OBTENER LOS TURNOS:', error);
        res.status(500).send('NO SE PUDO OBTENER EL LISTADO DE TURNOS.');
    }
});
exports.getAppointments = getAppointments;
/* OBTENER UN TURNO POR ID: */
const getAppointmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
        const appointment = yield appointmentRepository.findOne({
            where: { id: parseInt(id) }, /* Convertir el ID a número.*/
            relations: ['user'], /* Incluir la relación con el usuario.*/
        });
        if (!appointment) {
            res.status(404).send(`NO SE ENCONTRÓ EL TURNO CON ID: ${id}`);
            return;
        }
        res.status(200).json(appointment); /*Devolver el turno.*/
    }
    catch (error) {
        console.error(`ERROR AL OBTENER EL TURNO CON ID ${req.params.id}:`, error);
        res.status(500).send('NO SE PUDO OBTENER LA INFORMACIÓN DEL TURNO.');
    }
});
exports.getAppointmentById = getAppointmentById;
/* CREAR UN NUEVO TURNO: */
const scheduleAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, userId, description /*, status*/ } = req.body;
        if (!date || !time || !userId || !description /*|| !status*/) {
            /*res.status (400).send ('TODOS LOS CAMPOS SON OBLIGATORIOS.');
            return;*/
            res.status(400).json({ message: 'Faltan campos obligatorios: date, time, userId.' });
            return;
        }
        const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
        const userRepository = appDataSource_1.AppDataSource.getRepository(Users_1.User);
        /* Buscamos al usuario por ID.*/
        const user = yield userRepository.findOneBy({ id: userId });
        if (!user) {
            /*res.status (404).send ('NO SE ENCONTRÓ EL USUARIO.');*/
            res.status(400).json({ message: 'No se encontró el usuario con el ID proporcionado.' });
            return;
        }
        /* Creamos un nuevo turno.*/
        const newAppointment = appointmentRepository.create({
            date,
            time,
            user, // Asignamos el objeto de usuario completo
            status: 'active',
            description,
        });
        /* Guardamos el nuevo turno en la base de datos.*/
        yield appointmentRepository.save(newAppointment);
        /*res.status (201).json (newAppointment); /* Devolvemos el turno creado.*/
        // Responder con el turno creado
        res.status(201).json({
            message: 'Turno creado exitosamente.',
            appointment: newAppointment
        });
    }
    catch (error) {
        console.error('ERROR AL AGENDAR EL TURNO:', error);
        /*res.status (500).send ('NO SE PUDO AGENDAR EL TURNO.');*/
        res.status(500).json({ message: 'No se pudo agendar el turno.' });
    }
});
exports.scheduleAppointment = scheduleAppointment;
/* CANCELAR UN TURNO: */
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
        /* Buscamos el turno por ID.*/
        const appointment = yield appointmentRepository.findOneBy({ id: parseInt(id) });
        if (!appointment) {
            res.status(404).send(`NO SE ENCONTRÓ EL TURNO CON ID: ${id}`);
            return;
        }
        /* Actualizamos el estado a "cancelled".*/
        appointment.status = 'cancelled';
        /* Guardamos los cambios.*/
        yield appointmentRepository.save(appointment);
        res.status(200).json(appointment); /* Devolvemos el turno actualizado.*/
    }
    catch (error) {
        console.error('ERROR AL CANCELAR EL TURNO:', error);
        res.status(500).send('NO SE PUDO CANCELAR EL TURNO.');
    }
});
exports.cancelAppointment = cancelAppointment;
