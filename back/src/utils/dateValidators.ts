

// utils/dateValidators.ts

/**
 * Verifica si la fecha cae en fin de semana.
 * @param date - Fecha de la cita en formato ISO.
 * @returns boolean - true si es sábado o domingo, false en días de semana.
 */
export function isWeekend(date: string): boolean {
    /*const day = new Date(date).getDay();*/
    const day = new Date(Date.parse(date)).getUTCDay();

    return day === 0 || day === 6; // 6 es sábado, 0 es domingo
  }
  
  /**
   * Verifica si la hora está dentro del horario laboral (9:00 - 16:00).
   * @param time - Hora de la cita en formato 'HH:mm'.
   * @returns boolean - true si está dentro del horario, false en caso contrario.
   */
  export function isWithinWorkingHours(time: string): boolean {
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentTime = hours + minutes / 60;
    return appointmentTime >= 9 && appointmentTime < 16;
  }
  