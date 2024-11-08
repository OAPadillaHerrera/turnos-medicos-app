

import server from "./server";
import { PORT } from "./config/envs";
import "reflect-metadata";
import { AppDataSource } from "./config/appDataSource";

AppDataSource.initialize()
  .then(() => {
    console.log("CONEXIÓN A LA BASE DE DATOS REALIZADA CON ÉXITO.");

    server.listen(PORT, () => {
      console.log(`SERVER LISTENING ON PORT ${PORT} ...`);
    });
  })
  .catch((error) => {
    console.error("ERROR AL CONECTAR CON LA BASE DE DATOS: ", error);
  });



