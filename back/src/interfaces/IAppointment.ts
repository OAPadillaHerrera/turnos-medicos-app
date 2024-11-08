

interface IAppointment {

    id: number,
    date: Date,
    time: string,
    user: string,
    status: "active" | "cancelled",
    description: string,
    
}


export default IAppointment;