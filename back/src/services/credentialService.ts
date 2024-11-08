

import {AppDataSource} from '../config/appDataSource';
import {Credential} from '../entities/Credentials';

/* FUNCIÓN PARA CREAR UNA NUEVA CREDENCIAL:*/

export const crearCredencial = async (username: string, password: string): Promise <number> => {

  try {

    const credentialRepository = AppDataSource.getRepository (Credential);

    /* Verificar si el nombre de usuario ya existe.*/
    const existingCredential = await credentialRepository.findOneBy ({username});

    if (existingCredential) {

      throw new Error('EL NOMBRE DE USUARIO YA EXISTE.');

    }

    /* Crear una nueva credencial.*/
    const nuevaCredencial = credentialRepository.create ({

      username,
      password,

    });

    /* Guardar la nueva credencial en la base de datos.*/
    await credentialRepository.save (nuevaCredencial);
    return nuevaCredencial.id; /* Devolver el ID de la credencial creada.*/

  } catch (error) {

    console.error('ERROR AL CREAR LA CREDENCIAL:', error);
    throw new Error('NO SE PUDO CREAR LA CREDENCIAL.');

  }

};

/* FUNCIÓN PARA VALIDAR LA CREDENCIAL:*/
export const validarCredencial = async (username: string, password: string): Promise <number | string> => {

  try {

    const credentialRepository = AppDataSource.getRepository (Credential);

    /* Buscar la credencial en la base de datos*/
    const credencial = await credentialRepository.findOneBy({username, password});

    if (!credencial) {

      return 'NO SE ENCONTRÓ EL USUARIO O EL PASSWORD ES INCORRECTO.';

    }

    return credencial.id; /* Devolver el ID si la validación es correcta.*/

  } catch (error) {

    console.error('ERROR AL VALIDAR LA CREDENCIAL:', error);
    throw new Error('NO SE PUDO VALIDAR LA CREDENCIAL.');

  }

};


