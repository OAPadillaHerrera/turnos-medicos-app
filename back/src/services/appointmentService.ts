

import { AppDataSource } from '../config/appDataSource';
import { Appointment } from '../entities/Appointments';
import { User } from '../entities/Users';
import AppointmentDto from '../dto/AppointmentDto';

// Función para obtener todos los turnos
async function obtenerTurnos(): Promise<AppointmentDto[]> {
  try {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointments = await appointmentRepository.find({
      relations: ['user'],
    });

    const appointmentsDto: AppointmentDto[] = appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      user: appointment.user.id,
      status: appointment.status,
      description: appointment.description,
    }));

    return appointmentsDto;

  } catch (error) {
    console.error('ERROR OBTENIENDO TURNOS:', error);
    throw new Error('NO SE PUDIERON OBTENER LOS TURNOS.');
  }
}

// Nueva función para obtener turnos filtrados por usuario
async function obtenerTurnosPorUsuario(userId: number): Promise<AppointmentDto[]> {
  try {
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    // Filtrar los turnos por `userId`
    const appointments = await appointmentRepository.find({
      relations: ['user'],
      where: { user: { id: userId } } // Filtrar por el ID del usuario
    });

    const appointmentsDto: AppointmentDto[] = appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      user: appointment.user.id,
      status: appointment.status,
      description: appointment.description
    }));

    return appointmentsDto;

  } catch (error) {
    console.error('ERROR OBTENIENDO LOS TURNOS POR USUARIO:', error);
    throw new Error('NO SE PUDIERON OBTENER LOS TURNOS DEL USUARIO.');
  }
}

// Función para obtener un turno específico por ID
async function obtenerTurno(id: number): Promise<AppointmentDto | undefined> {
  try {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointment = await appointmentRepository.findOneBy({ id });

    if (!appointment) {
      return undefined;
    }

    const appointmentDto: AppointmentDto = {
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      user: appointment.user.id,
      status: appointment.status,
      description: appointment.description,
    };

    return appointmentDto;

  } catch (error) {
    console.error('ERROR OBTENIENDO EL TURNO:', error);
    throw new Error('NO SE PUDO OBTENER EL TURNO.');
  }
}

// Función para crear un nuevo turno
async function crearTurno(
  date: Date,
  time: string,
  userId: number,
  status: 'active' | 'cancelled',
  description: string
): Promise<AppointmentDto> {
  try {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

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

    await appointmentRepository.save(newAppointment);

    const newAppointmentDto: AppointmentDto = {
      id: newAppointment.id,
      date: newAppointment.date,
      time: newAppointment.time,
      user: newAppointment.user.id,
      status: newAppointment.status,
      description: newAppointment.description,
    };

    return newAppointmentDto;

  } catch (error) {
    console.error('ERROR CREANDO EL TURNO:', error);
    throw new Error('NO SE PUDO CREAR EL TURNO.');
  }
}

// Función para cancelar un turno
async function cancelarTurno(id: number): Promise<AppointmentDto | string> {
  try {
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const appointment = await appointmentRepository.findOneBy({ id });

    if (!appointment) {
      return 'NO SE ENCONTRÓ EL ID.';
    }

    appointment.status = 'cancelled';
    await appointmentRepository.save(appointment);

    const appointmentDto: AppointmentDto = {
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      user: appointment.user.id,
      status: 'cancelled',
      description: appointment.description,
    };

    return appointmentDto;

  } catch (error) {
    console.error('ERROR CANCELANDO EL TURNO:', error);
    throw new Error('NO SE PUDO CANCELAR EL TURNO.');
  }
}

// Exportamos todas las funciones
export {
  obtenerTurnos,
  obtenerTurnosPorUsuario,
  obtenerTurno,
  crearTurno,
  cancelarTurno
};


