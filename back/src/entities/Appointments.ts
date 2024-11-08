

import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {User} from "./Users";

@Entity ({

    name: "appointments"

})

export class Appointment {

    @PrimaryGeneratedColumn ()
    id: number;

    @Column ({
        type: "date"

    })
    date: Date;

    @Column ({

        length: 50

    })
    time: string;

    @Column ({

        type: "enum",
        enum: ["active", "cancelled"],
        default: "active"

    })
    status: "active" | "cancelled";

    @Column ({

        length: 100

    })
    description: string;


    /* Relación Many-to-One con la entidad User.*/
    @ManyToOne (() => User, user => user.appointments)
    user: User;

}