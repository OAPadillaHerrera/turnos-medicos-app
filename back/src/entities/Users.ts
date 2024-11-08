

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn} from 'typeorm';
import {Credential} from "./Credentials";
import {Appointment} from './Appointments';

@Entity({

    name: "users"

})

export class User {

    @PrimaryGeneratedColumn ()
    id: number;

    @Column ({

        length: 100

    })
    name: string;

    @Column ({

        length: 100

    })
    email: string;

    @Column ({

        type: "date"

    })
    birthdate: Date;

    @Column ("int")
    nDni: number;

    @OneToOne(() => Credential)  
    @JoinColumn ({ name: 'credentialsId' }) /* Aquí se agrega el JoinColumn para especificar la clave foránea.*/
    credentials: Credential;  

    @OneToMany(() => Appointment, appointment => appointment.user)
    appointments: Appointment[]; /* Relación con turnos.*/

}