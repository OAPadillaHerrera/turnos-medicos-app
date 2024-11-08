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
exports.loginUsuario = void 0;
exports.obtenerUsuarios = obtenerUsuarios;
exports.obtenerUsuario = obtenerUsuario;
exports.crearUsuario = crearUsuario;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appDataSource_1 = require("../config/appDataSource");
const Users_1 = require("../entities/Users");
const Credentials_1 = require("../entities/Credentials");
/* FUNCIÓN PARA OBTENER TODOS LOS USUARIOS */
function obtenerUsuarios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userRepository = appDataSource_1.AppDataSource.getRepository(Users_1.User);
            const users = yield userRepository.find({
                relations: ['credentials'],
            });
            const usersDto = users.map((user) => ({
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
        }
        catch (error) {
            console.error('ERROR OBTENIENDO USUARIOS:', error);
            throw new Error('NO SE PUDIERON OBTENER LOS USUARIOS.');
        }
    });
}
/* FUNCIÓN PARA OBTENER UN USUARIO POR ID */
function obtenerUsuario(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userRepository = appDataSource_1.AppDataSource.getRepository(Users_1.User);
            const user = yield userRepository.findOne({
                where: { id },
                relations: ['credentials', 'appointments'],
            });
            if (!user) {
                return undefined;
            }
            const turnsDto = user.appointments.map((appointment) => ({
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                description: appointment.description,
                user: user.id,
            }));
            const userDto = {
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
        }
        catch (error) {
            console.error('ERROR OBTENIENDO EL USUARIO:', error);
            throw new Error('NO SE PUDO ENCONTRAR EL USUARIO.');
        }
    });
}
/* FUNCIÓN PARA CREAR UN NUEVO USUARIO */
function crearUsuario(name, email, birthdate, nDni, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentialRepository = appDataSource_1.AppDataSource.getRepository(Credentials_1.Credential);
            const credentials = credentialRepository.create({
                username,
                password,
            });
            yield credentialRepository.save(credentials);
            const userRepository = appDataSource_1.AppDataSource.getRepository(Users_1.User);
            const newUser = userRepository.create({
                name,
                email,
                birthdate,
                nDni,
                credentials,
            });
            yield userRepository.save(newUser);
            const newUserDto = {
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
        }
        catch (error) {
            console.error('ERROR CREANDO EL USUARIO:', error);
            throw new Error('NO SE PUDO CREAR EL USUARIO.');
        }
    });
}
/* FUNCIÓN PARA INICIAR SESIÓN */
const loginUsuario = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!username || !password) {
            throw new Error('Faltan campos obligatorios.');
        }
        const userRepository = appDataSource_1.AppDataSource.getRepository(Users_1.User);
        const user = yield userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.credentials", "credentials")
            .where("credentials.username = :username", { username })
            .andWhere("credentials.password = :password", { password })
            .getOne();
        if (!user) {
            return null;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' }); // Genera el token con una clave secreta y expiración
        const userDto = {
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
    }
    catch (error) {
        console.error('ERROR AL INICIAR SESIÓN:', error);
        throw error;
    }
});
exports.loginUsuario = loginUsuario;
