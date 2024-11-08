

import { Request, Response } from 'express';
import { AppDataSource } from '../config/appDataSource';
import { Appointment } from '../entities/Appointments';
import { User } from '../entities/Users';
import { AuthenticatedRequest } from "../middlewares/auth"; // Asegúrate de importar tu interfaz
import { isWeekend, isWithinWorkingHours } from '../../src/utils/dateValidators'; // Funciones de validación que vamos a definir


/* OBTENER LOS TURNOS DEL USUARIO LOGUEADO */
export const getAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // Accede directamente a userId

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado.' });
      return; // Asegúrate de retornar aquí
    }

    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointments = await appointmentRepository.find({
      relations: ['user'],
      where: { user: { id: userId } }, // userId ya es del tipo correcto
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('ERROR AL OBTENER LOS TURNOS:', error);
    res.status(500).send('NO SE PUDO OBTENER EL LISTADO DE TURNOS.');
  }
};

/* OBTENER UN TURNO POR ID */
export const getAppointmentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    const appointment = await appointmentRepository.findOne({
      where: { id: parseInt(id) }, // Convertir el ID a número
      relations: ['user'], // Incluir la relación con el usuario
    });

    if (!appointment) {
      res.status(404).send(`NO SE ENCONTRÓ EL TURNO CON ID: ${id}`);
      return;
    }

    res.status(200).json(appointment); // Devolver el turno
  } catch (error) {
    console.error(`ERROR AL OBTENER EL TURNO CON ID ${req.params.id}:`, error);
    res.status(500).send('NO SE PUDO OBTENER LA INFORMACIÓN DEL TURNO.');
  }
};

/* CREAR UN NUEVO TURNO */
export const scheduleAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { date, time, description } = req.body;

    if (!date || !time || !description) {
      res.status(400).json({ message: 'Faltan campos obligatorios: date, time, description.' });
      return;
    }

    // Validar que el día no sea sábado ni domingo - AGREGADO RECIEN.
    if (isWeekend(date)) {
      res.status(400).json({ message: 'No se pueden agendar turnos los fines de semana.' });
      return;
    }

    // Validar que la hora esté entre las 9:00 y 16:00 -AGREGADO RECIEN.
    if (!isWithinWorkingHours(time)) {
      res.status(400).json({ message: 'La hora de la cita debe estar entre las 9:00 y las 16:00.' });
      return;
    }

    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const userId = req.user?.id; // Obtén userId de req.user

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado.' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(400).json({ message: 'No se encontró el usuario con el ID proporcionado.' });
      return;
    }

    // Creamos un nuevo turno
    const newAppointment = appointmentRepository.create({
      date,
      time,
      user, // Asignamos el objeto de usuario completo
      status: 'active',
      description,
    });

    // Guardamos el nuevo turno en la base de datos
    await appointmentRepository.save(newAppointment);
    res.status(201).json({
      message: 'Turno creado exitosamente.',
      appointment: newAppointment,
    });
  } catch (error:any) {
    console.error('ERROR AL AGENDAR EL TURNO:', error);
    res.status(500).json({ message: error.message || 'No se pudo agendar el turno.' });
  }
};

/* CANCELAR UN TURNO */
export const cancelAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
      const { id } = req.params;
      const appointmentRepository = AppDataSource.getRepository(Appointment);

      // Buscamos el turno por ID
      const appointment = await appointmentRepository.findOneBy({ id: parseInt(id) });

      if (!appointment) {
          res.status(404).send(`NO SE ENCONTRÓ EL TURNO CON ID: ${id}`);
          return;
      }

      // Crear la fecha de hoy en UTC solo con año, mes y día
      const today = new Date();
      const todayUTCOnly = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

      // Convertir appointment.date de string a Date, y obtener solo año, mes y día en UTC
      const appointmentDate = new Date(appointment.date as unknown as string);
      const appointmentDateUTCOnly = Date.UTC(appointmentDate.getUTCFullYear(), appointmentDate.getUTCMonth(), appointmentDate.getUTCDate());

      // Calcular la diferencia en días en UTC
      const differenceInDays = Math.floor((appointmentDateUTCOnly - todayUTCOnly) / (1000 * 60 * 60 * 24));

      // Debugging: Verificar en consola
      console.log("Fecha de hoy (UTC sin horas):", new Date(todayUTCOnly));
      console.log("Fecha de la cita (UTC sin horas):", new Date(appointmentDateUTCOnly));
      console.log("Diferencia en días:", differenceInDays);

      // Verificar si la fecha de hoy es posterior o igual a la fecha de la cita
      if (differenceInDays < 1) {
          res.status(400).json({ message: 'NO SE PUEDE CANCELAR EL TURNO EL MISMO DÍA O DESPUÉS DE LA FECHA DE LA CITA.' });
          return;
      }

      // Actualizamos el estado a "cancelled"
      appointment.status = 'cancelled';

      // Guardamos los cambios
      await appointmentRepository.save(appointment);
      res.status(200).json(appointment); // Devolvemos el turno actualizado
  } catch (error) {
      console.error('ERROR AL CANCELAR EL TURNO:', error);
      res.status(500).send('NO SE PUDO CANCELAR EL TURNO.');
  }
};


