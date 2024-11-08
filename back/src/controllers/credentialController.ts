

import {Request, Response} from 'express';
import {crearCredencial, validarCredencial} from '../services/credentialService';

/* CONTROLADOR PARA CREAR UNA NUEVA CREDENCIAL: */
export const createCredential = async (req: Request, res: Response): Promise <void> => {

  try {

    const {username, password} = req.body;

    /* Validamos que ambos campos estén presentes.*/
    if (!username || !password) {

      res.status (400).send ('FALTAN DATOS: SE REQUIEREN "username" y "password".');
      return;

    }

    /* Llamamos al servicio para crear la credencial.*/
    const newCredentialId = await crearCredencial (username, password);

    /* Devolvemos el ID de la nueva credencial creada.*/
    res.status (201).json ({id: newCredentialId, message: 'CREDENCIAL CREADA EXITOSAMENTE.'});

  } catch (error) {

    /* Hacemos un cast del error a `Error` para acceder a la propiedad `message`.*/
    const err = error as Error;
    res.status (500).send (err.message || 'NO SE PUDO CREAR LA CREDENCIAL.');

  }

};

/* CONTROLADOR PARA VALIDAR UNA CREDENCIAL:*/
export const validateCredential = async (req: Request, res: Response): Promise <void> => {

  try {

    const {username, password} = req.body;

    /* Validamos que ambos campos estén presentes.*/

    if (!username || !password) {

      res.status (400).send ('FALTAN DATOS: SE REQUIEREN "username" y "password".');
      return;

    }

    /* Llamamos al servicio para validar la credencial.*/
    const validationResponse = await validarCredencial (username, password);

    /* Si se devuelve un número, es el ID del usuario validado.*/

    if (typeof validationResponse === 'number') {

      res.status (200).json ({id: validationResponse, message: 'CREDENCIAL VALIDADA EXITOSAMENTE.'});

    } else {

      /* Si se devuelve una cadena, es un mensaje de error.*/
      res.status (401).json ({ message: validationResponse });

    }
  } catch (error) {

    console.error('ERROR AL VALIDAR LA CREDENCIAL:', error);
    res.status(500).send('NO SE PUDO VALIDAR LA CREDENCIAL.');

  }
  
};
