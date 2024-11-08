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
exports.obtenerTurnos = obtenerTurnos;
exports.obtenerTurnosPorUsuario = obtenerTurnosPorUsuario;
exports.obtenerTurno = obtenerTurno;
exports.crearTurno = crearTurno;
exports.cancelarTurno = cancelarTurno;
const appDataSource_1 = require("../config/appDataSource");
const Appointments_1 = require("../entities/Appointments");
const Users_1 = require("../entities/Users");
// Función para obtener todos los turnos
function obtenerTurnos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
            const appointments = yield appointmentRepository.find({
                relations: ['user'],
            });
            const appointmentsDto = appointments.map((appointment) => ({
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                user: appointment.user.id,
                status: appointment.status,
                description: appointment.description,
            }));
            return appointmentsDto;
        }
        catch (error) {
            console.error('ERROR OBTENIENDO TURNOS:', error);
            throw new Error('NO SE PUDIERON OBTENER LOS TURNOS.');
        }
    });
}
// Nueva función para obtener turnos filtrados por usuario
function obtenerTurnosPorUsuario(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
            // Filtrar los turnos por `userId`
            const appointments = yield appointmentRepository.find({
                relations: ['user'],
                where: { user: { id: userId } } // Filtrar por el ID del usuario
            });
            const appointmentsDto = appointments.map((appointment) => ({
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                user: appointment.user.id,
                status: appointment.status,
                description: appointment.description
            }));
            return appointmentsDto;
        }
        catch (error) {
            console.error('ERROR OBTENIENDO LOS TURNOS POR USUARIO:', error);
            throw new Error('NO SE PUDIERON OBTENER LOS TURNOS DEL USUARIO.');
        }
    });
}
// Función para obtener un turno específico por ID
function obtenerTurno(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
            const appointment = yield appointmentRepository.findOneBy({ id });
            if (!appointment) {
                return undefined;
            }
            const appointmentDto = {
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                user: appointment.user.id,
                status: appointment.status,
                description: appointment.description,
            };
            return appointmentDto;
        }
        catch (error) {
            console.error('ERROR OBTENIENDO EL TURNO:', error);
            throw new Error('NO SE PUDO OBTENER EL TURNO.');
        }
    });
}
// Función para crear un nuevo turno
function crearTurno(date, time, userId, status, description) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
            const userRepository = appDataSource_1.AppDataSource.getRepository(Users_1.User);
            const user = yield userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new Error('NO SE PUDO ENCONTRAR EL USUARIO.');
            }
            const newAppointment = appointmentRepository.create({
                date,
                time,
                user,
                status,
                description,
            });
            yield appointmentRepository.save(newAppointment);
            const newAppointmentDto = {
                id: newAppointment.id,
                date: newAppointment.date,
                time: newAppointment.time,
                user: newAppointment.user.id,
                status: newAppointment.status,
                description: newAppointment.description,
            };
            return newAppointmentDto;
        }
        catch (error) {
            console.error('ERROR CREANDO EL TURNO:', error);
            throw new Error('NO SE PUDO CREAR EL TURNO.');
        }
    });
}
// Función para cancelar un turno
function cancelarTurno(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointmentRepository = appDataSource_1.AppDataSource.getRepository(Appointments_1.Appointment);
            const appointment = yield appointmentRepository.findOneBy({ id });
            if (!appointment) {
                return 'NO SE ENCONTRÓ EL ID.';
            }
            appointment.status = 'cancelled';
            yield appointmentRepository.save(appointment);
            const appointmentDto = {
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                user: appointment.user.id,
                status: 'cancelled',
                description: appointment.description,
            };
            return appointmentDto;
        }
        catch (error) {
            console.error('ERROR CANCELANDO EL TURNO:', error);
            throw new Error('NO SE PUDO CANCELAR EL TURNO.');
        }
    });
}
