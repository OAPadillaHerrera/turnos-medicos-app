"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credentialController_1 = require("../controllers/credentialController");
const router = (0, express_1.Router)();
/* Rutas de credenciales. */
router.post('/create', credentialController_1.createCredential); // Crear una nueva credencial
router.post('/validate', credentialController_1.validateCredential); // Validar una credencial
exports.default = router;
