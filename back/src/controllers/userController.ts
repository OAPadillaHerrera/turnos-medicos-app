

// src/controllers/userController.ts
import { Request, Response } from 'express';
import { obtenerUsuarios, obtenerUsuario, crearUsuario } from '../services/usersService';
import { loginUsuario } from '../services/usersService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Función para generar un token JWT
export const generateToken = (userId: number): string => {
  // Verificamos si `JWT_SECRET` está definido antes de usarlo
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta configurar JWT_SECRET en las variables de entorno');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

/* FUNCIÓN PARA OBTENER TODOS LOS USUARIOS */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await obtenerUsuarios();
    const usersWithoutCredentialsId = users.map(({ credentialsId, ...rest }) => rest);
    res.json(usersWithoutCredentialsId);
  } catch (error) {
    console.error('ERROR AL OBTENER LOS USUARIOS:', error);
    res.status(500).send('NO SE PUDO OBTENER EL LISTADO DE USUARIOS');
  }
};

/* FUNCIÓN PARA OBTENER UN USUARIO POR ID */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const user = await obtenerUsuario(userId);

    if (user) {
      const { username, password, credentialsId, ...userWithoutSensitiveData } = user;
      res.json(userWithoutSensitiveData);
    } else {
      res.status(404).send(`NO SE ENCONTRÓ USUARIO CON ID ${userId}.`);
    }
  } catch (error) {
    console.error(`ERROR AL OBTENER EL USUARIO CON ID ${req.params.id}:`, error);
    res.status(500).send('NO SE PUDO OBTENER LA INFORMACIÓN DEL USUARIO.');
  }
};

/* FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extracción y validación de campos antes de crear el usuario
    const { name, email, birthdate, nDni, username, password } = req.body;

    console.log("Datos recibidos en el backend:", req.body);

    if (!name || !email || !birthdate || !nDni || !username || !password) {
      res.status(400).json({ message: 'FALTAN CAMPOS OBLIGATORIOS.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dniRegex = /^\d{8}$/;
    const minPasswordLength = 6;

    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'El formato del correo electrónico es incorrecto.' });
      return;
    }

    const birthDateObj = new Date(birthdate);
    if (isNaN(birthDateObj.getTime())) {
      res.status(400).json({ message: 'La fecha de nacimiento es incorrecta.' });
      return;
    }

    if (!dniRegex.test(nDni)) {
      res.status(400).json({ message: 'El formato del DNI es incorrecto.' });
      return;
    }

    if (password.length < minPasswordLength) {
      res.status(400).json({ message: `La contraseña debe tener al menos ${minPasswordLength} caracteres.` });
      return;
    }

    // Una vez pasada la validación, crear el usuario en la base de datos
    const newUser = await crearUsuario(name, email, new Date(birthdate), nDni, username, password);

    // Generar el token después de crear el usuario
    const token = generateToken(newUser.id);

    // Enviar respuesta con el token y datos del usuario
    res.status(201).json({
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        birthdate: newUser.birthdate,
        nDni: newUser.nDni,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('ERROR AL REGISTRAR EL USUARIO.', error);
    res.status(500).json({ message: 'NO SE PUDO REGISTRAR EL USUARIO.' });
  }
};


/* FUNCIÓN PARA INICIAR SESIÓN EN EL CONTROLADOR */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Faltan campos obligatorios.' });
      return;
    }

    const result = await loginUsuario(username, password);

    if (!result) {
      res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
      return;
    }

    const { user } = result;
    const token = generateToken(user.id);

    const { password: _, username: __, credentialsId: ___, ...userResponse } = user;

    res.status(200).json({
      login: true,
      user: userResponse,
      token: token
    });
  } catch (error) {
    console.error('ERROR AL INICIAR SESIÓN:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};






