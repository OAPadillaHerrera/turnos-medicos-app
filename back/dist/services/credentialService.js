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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCredencial = exports.crearCredencial = void 0;
const appDataSource_1 = require("../config/appDataSource");
const Credentials_1 = require("../entities/Credentials");
/* FUNCIÓN PARA CREAR UNA NUEVA CREDENCIAL:*/
const crearCredencial = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentialRepository = appDataSource_1.AppDataSource.getRepository(Credentials_1.Credential);
        /* Verificar si el nombre de usuario ya existe.*/
        const existingCredential = yield credentialRepository.findOneBy({ username });
        if (existingCredential) {
            throw new Error('EL NOMBRE DE USUARIO YA EXISTE.');
        }
        /* Crear una nueva credencial.*/
        const nuevaCredencial = credentialRepository.create({
            username,
            password,
        });
        /* Guardar la nueva credencial en la base de datos.*/
        yield credentialRepository.save(nuevaCredencial);
        return nuevaCredencial.id; /* Devolver el ID de la credencial creada.*/
    }
    catch (error) {
        console.error('ERROR AL CREAR LA CREDENCIAL:', error);
        throw new Error('NO SE PUDO CREAR LA CREDENCIAL.');
    }
});
exports.crearCredencial = crearCredencial;
/* FUNCIÓN PARA VALIDAR LA CREDENCIAL:*/
const validarCredencial = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentialRepository = appDataSource_1.AppDataSource.getRepository(Credentials_1.Credential);
        /* Buscar la credencial en la base de datos*/
        const credencial = yield credentialRepository.findOneBy({ username, password });
        if (!credencial) {
            return 'NO SE ENCONTRÓ EL USUARIO O EL PASSWORD ES INCORRECTO.';
        }
        return credencial.id; /* Devolver el ID si la validación es correcta.*/
    }
    catch (error) {
        console.error('ERROR AL VALIDAR LA CREDENCIAL:', error);
        throw new Error('NO SE PUDO VALIDAR LA CREDENCIAL.');
    }
});
exports.validarCredencial = validarCredencial;
