

// src/middlewares/auth.js
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/Users";
import { AppDataSource } from "../config/appDataSource";
import dotenv from "dotenv";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: User; // Definimos la propiedad user
}

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "ERROR: FALTA AUTENTICACIÓN" });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log("Token recibido:", token); // Agregar este log para ver el token recibido

  if (!token) {
    res.status(401).json({ message: "ERROR: TOKEN NO PROPORCIONADO" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    console.log("Datos decodificados del token:", decoded); // Verificar el contenido del token

    // Buscar al usuario en la base de datos
    const user = await AppDataSource.getRepository(User).findOneBy({ id: decoded.id });
    if (!user) {
      res.status(401).json({ message: "ERROR: USUARIO NO ENCONTRADO" });
      return;
    }

    req.user = user; // Asigna el usuario completo a `req.user`
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "ERROR: TOKEN EXPIRADO" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "ERROR: TOKEN NO VÁLIDO" });
    } else {
      console.error("ERROR INTERNO DEL SERVIDOR:", error);
      res.status(500).json({ message: "ERROR: ERROR INTERNO DEL SERVIDOR" });
    }
  }
};

export default auth;









