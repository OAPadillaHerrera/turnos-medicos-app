

import express, {Request, Response, NextFunction} from 'express';
import userRoutes from './routes/users';  /* Importar el enrutador de usuarios.*/
import credentialRoutes from './routes/credentials';  /* Importar el enrutador de credenciales.*/
import appointmentRoutes from './routes/appointments';  /* Importar el enrutador de turnos.*/
import morgan from "morgan";
import cors from "cors";


const server = express();

server.use (morgan ("dev"));

/* Middleware para parsear JSON.*/
server.use (express.json ());

server.use (cors ());

/* Usar las rutas de usuarios bajo la ruta "/users".*/
server.use ('/users', userRoutes);

/* Usar las rutas de turnos bajo la ruta "/appointments".*/
server.use ('/appointments', appointmentRoutes);

/* Usar las rutas de turnos bajo la ruta "/credentials".*/
server.use ('/credentials', credentialRoutes);

/* Middleware para manejar rutas no encontradas (404).*/
server.use((req: Request, res: Response, next: NextFunction) => {

  res.status(404).json({ message: 'RUTA NO ENCONTRADA.' });

});

// Middleware general de manejo de errores
server.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  console.error(err.stack);

  res.status(500).json({ message: 'OCURRIÓ UN ERROR EN EL SERVIDOR.' });

  });


export default server;

/*------------------*/


/*import express from "express";
import router from "./routes";

const server = express ();
server.use (express.json ());

server.use (router);

export default server;*/

