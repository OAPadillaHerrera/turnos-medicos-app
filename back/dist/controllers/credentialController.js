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
exports.validateCredential = exports.createCredential = void 0;
const credentialService_1 = require("../services/credentialService");
/* CONTROLADOR PARA CREAR UNA NUEVA CREDENCIAL: */
const createCredential = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        /* Validamos que ambos campos estén presentes.*/
        if (!username || !password) {
            res.status(400).send('FALTAN DATOS: SE REQUIEREN "username" y "password".');
            return;
        }
        /* Llamamos al servicio para crear la credencial.*/
        const newCredentialId = yield (0, credentialService_1.crearCredencial)(username, password);
        /* Devolvemos el ID de la nueva credencial creada.*/
        res.status(201).json({ id: newCredentialId, message: 'CREDENCIAL CREADA EXITOSAMENTE.' });
    }
    catch (error) {
        /* Hacemos un cast del error a `Error` para acceder a la propiedad `message`.*/
        const err = error;
        res.status(500).send(err.message || 'NO SE PUDO CREAR LA CREDENCIAL.');
    }
});
exports.createCredential = createCredential;
/* CONTROLADOR PARA VALIDAR UNA CREDENCIAL:*/
const validateCredential = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        /* Validamos que ambos campos estén presentes.*/
        if (!username || !password) {
            res.status(400).send('FALTAN DATOS: SE REQUIEREN "username" y "password".');
            return;
        }
        /* Llamamos al servicio para validar la credencial.*/
        const validationResponse = yield (0, credentialService_1.validarCredencial)(username, password);
        /* Si se devuelve un número, es el ID del usuario validado.*/
        if (typeof validationResponse === 'number') {
            res.status(200).json({ id: validationResponse, message: 'CREDENCIAL VALIDADA EXITOSAMENTE.' });
        }
        else {
            /* Si se devuelve una cadena, es un mensaje de error.*/
            res.status(401).json({ message: validationResponse });
        }
    }
    catch (error) {
        console.error('ERROR AL VALIDAR LA CREDENCIAL:', error);
        res.status(500).send('NO SE PUDO VALIDAR LA CREDENCIAL.');
    }
});
exports.validateCredential = validateCredential;
