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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = require("../entities/Users"); // Ajusta la ruta según la ubicación
const appDataSource_1 = require("../config/appDataSource"); // Importa tu configuración de base de datos
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carga las variables de entorno
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "ERROR: FALTA AUTENTICACIÓN" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "ERROR: TOKEN NO PROPORCIONADO" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Buscar al usuario completo en la base de datos
        const user = yield appDataSource_1.AppDataSource.getRepository(Users_1.User).findOneBy({ id: decoded.id });
        if (!user) {
            res.status(401).json({ message: "ERROR: USUARIO NO ENCONTRADO" });
            return;
        }
        req.user = user; // Asigna el usuario completo a `req.user`
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: "ERROR: TOKEN EXPIRADO" });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({ message: "ERROR: TOKEN NO VÁLIDO" });
        }
        else {
            res.status(500).json({ message: "ERROR: ERROR INTERNO DEL SERVIDOR" });
        }
    }
});
exports.default = auth;
