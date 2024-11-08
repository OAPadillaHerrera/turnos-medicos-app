

import AppointmentDto from '../dto/AppointmentDto';

interface UserDto {

  id: number;
  name: string;
  email: string;
  birthdate: Date;
  nDni: number;
  credentialsId: number;
  turns?: AppointmentDto [];
  username: string;
  password: string; /* Incluir la contraseña en el DTO.*/

}

export default UserDto;