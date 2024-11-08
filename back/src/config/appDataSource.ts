

import {DataSource} from "typeorm";
import {User} from "../entities/Users";
import {Credential} from "../entities/Credentials";
import {Appointment} from "../entities/Appointments";
import * as dotenv from "dotenv";

dotenv.config ();

export const AppDataSource = new DataSource ({

    type: "postgres",
    host: process.env.DB_HOST,                 
    port: parseInt (process.env.DB_PORT || "5432", 10),     
    username: process.env.DB_USERNAME,           
    password: process.env.DB_PASSWORD,           
    database: process.env.DB_DATABASE,          
    synchronize: true,                         
    logging: true,                               
    entities: [User, Credential, Appointment],   
    migrations: [],                              
    subscribers: [],    
                             
})

