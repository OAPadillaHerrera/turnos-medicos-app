

import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/appDataSource';
import { User } from '../entities/Users'; 
import UserDto from '../dto/UserDto';
import { Credential } from '../entities/Credentials';
import AppointmentDto from '../dto/AppointmentDto';
import { Request, Response } from 'express';

/* FUNCIÓN PARA OBTENER TODOS LOS USUARIOS */
async function obtenerUsuarios(): Promise<UserDto[]> {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      relations: ['credentials'],
    });

    const usersDto: UserDto[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      nDni: user.nDni,
      credentialsId: user.credentials.id,
      username: user.credentials.username,
      password: user.credentials.password,
    }));

    return usersDto;
  } catch (error) {
    console.error('ERROR OBTENIENDO USUARIOS:', error);
    throw new Error('NO SE PUDIERON OBTENER LOS USUARIOS.');
  }
}

/* FUNCIÓN PARA OBTENER UN USUARIO POR ID */
async function obtenerUsuario(id: number): Promise<UserDto | undefined> {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      relations: ['credentials', 'appointments'],
    });

    if (!user) {
      return undefined;
    }

    const turnsDto: AppointmentDto[] = user.appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      description: appointment.description,
      user: user.id,
    }));

    const userDto: UserDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      nDni: user.nDni,
      credentialsId: user.credentials.id,
      turns: turnsDto,
      username: user.credentials.username,
      password: user.credentials.password,
    };

    return userDto;
  } catch (error) {
    console.error('ERROR OBTENIENDO EL USUARIO:', error);
    throw new Error('NO SE PUDO ENCONTRAR EL USUARIO.');
  }
}

/* FUNCIÓN PARA CREAR UN NUEVO USUARIO */
async function crearUsuario(
  name: string,
  email: string,
  birthdate: Date,
  nDni: number,
  username: string,
  password: string
): Promise<UserDto> {
  try {
    const credentialRepository = AppDataSource.getRepository(Credential);
    const credentials = credentialRepository.create({
      username,
      password,
    });

    await credentialRepository.save(credentials);

    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create({
      name,
      email,
      birthdate,
      nDni,
      credentials,
    });

    await userRepository.save(newUser);

    const newUserDto: UserDto = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      birthdate: newUser.birthdate,
      nDni: newUser.nDni,
      credentialsId: newUser.credentials.id,
      username: newUser.credentials.username,
      password: newUser.credentials.password,
    };

    return newUserDto;
  } catch (error) {
    console.error('ERROR CREANDO EL USUARIO:', error);
    throw new Error('NO SE PUDO CREAR EL USUARIO.');
  }
}

/* FUNCIÓN PARA INICIAR SESIÓN */
export const loginUsuario = async (username: string, password: string): Promise<{ user: UserDto, token: string } | null> => {
  try {
      if (!username || !password) {
          throw new Error('Faltan campos obligatorios.');
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.credentials", "credentials")
          .where("credentials.username = :username", { username })
          .andWhere("credentials.password = :password", { password })
          .getOne();

      if (!user) {
          return null;
      }

      const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' }); // Genera el token con una clave secreta y expiración

      const userDto: UserDto = {
          id: user.id,
          name: user.name,
          email: user.email,
          birthdate: user.birthdate,
          nDni: user.nDni,
          credentialsId: user.credentials.id,
          username: user.credentials.username,
          password: user.credentials.password,
      };

      return { user: userDto, token }; // Devuelve el usuario y el token
  } catch (error) {
      console.error('ERROR AL INICIAR SESIÓN:', error);
      throw error;
  }
};

export { obtenerUsuarios, obtenerUsuario, crearUsuario };


