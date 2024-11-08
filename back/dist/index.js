"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const envs_1 = require("./config/envs");
require("reflect-metadata");
const appDataSource_1 = require("./config/appDataSource");
appDataSource_1.AppDataSource.initialize()
    .then(() => {
    console.log("CONEXIÓN A LA BASE DE DATOS REALIZADA CON ÉXITO.");
    server_1.default.listen(envs_1.PORT, () => {
        console.log(`SERVER LISTENING ON PORT ${envs_1.PORT} ...`);
    });
})
    .catch((error) => {
    console.error("ERROR AL CONECTAR CON LA BASE DE DATOS: ", error);
});
