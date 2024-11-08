

interface AppointmentDto {

    id: number;
    date: Date;
    time: string;
    user: number;
    status: "active" | "cancelled";
    description: string;

  }
  
export default AppointmentDto;
