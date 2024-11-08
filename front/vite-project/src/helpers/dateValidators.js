

/// helpers /dateValidators.ts

/**
 * Verifica si la fecha cae en fin de semana.
 * @param date - Fecha de la cita en formato ISO.
 * @returns boolean - true si es sábado o domingo, false en días de semana.
 */
export function isWeekend(date) {
  /*const day = new Date(date).getDay();*/
  const day = new Date(Date.parse(date)).getUTCDay();

  return day === 0 || day === 6; // 6 es sábado, 0 es domingo
}

/**
 * Verifica si la hora está dentro del horario laboral (9:00 - 16:00).
 * @param time - Hora de la cita en formato 'HH:mm'.
 * @returns boolean - true si está dentro del horario, false en caso contrario.
 */
export function isWithinWorkingHours(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const appointmentTime = hours + minutes / 60;
  return appointmentTime >= 9 && appointmentTime < 16;
}


/**
 * Verifica si una cita es cancelable (es al menos un día después de la fecha actual).
 * @param appointmentDate - Fecha de la cita en formato ISO (ej. "2024-11-08").
 * @returns boolean - true si la cita es cancelable, false en caso contrario.
 */
export function isCancelableDate(appointmentDate) {
  // Crear la fecha de hoy sin horas en UTC
  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  // Crear la fecha de la cita sin horas en UTC
  const appointment = new Date(appointmentDate);
  const appointmentUTC = Date.UTC(appointment.getFullYear(), appointment.getMonth(), appointment.getDate());

  // Calcular la diferencia en días
  const differenceInDays = (appointmentUTC - todayUTC) / (1000 * 60 * 60 * 24);

  // Debugging: Verificar en consola
  console.log("Fecha de hoy (UTC sin horas):", new Date(todayUTC).toUTCString());
  console.log("Fecha de la cita (UTC sin horas):", new Date(appointmentUTC).toUTCString());
  console.log("Diferencia en días:", differenceInDays);

  // Permitir cancelar solo si la cita es al menos un día después de hoy
  return differenceInDays >= 1;
}




 /**
 * Verifica si una cita es cancelable (es al menos un día después de la fecha actual).
 * @param appointmentDate - Fecha de la cita en formato ISO (ej. "2024-11-08").
 * @returns boolean - true si la cita es cancelable, false en caso contrario.
 */
/*export function isCancelableDate(appointmentDate) {
  // Crear la fecha de hoy en UTC sin componentes de hora
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  // Crear la fecha de la cita en UTC sin componentes de hora
  const appointment = new Date(appointmentDate);
  const appointmentUTC = new Date(Date.UTC(appointment.getUTCFullYear(), appointment.getUTCMonth(), appointment.getUTCDate()));

  // Calcular la diferencia en días enteros
  const differenceInDays = (appointmentUTC - todayUTC) / (1000 * 60 * 60 * 24);

  // Debugging: Verificar en consola
  console.log("Fecha de hoy (UTC sin horas):", todayUTC.toUTCString());
  console.log("Fecha de la cita (UTC sin horas):", appointmentUTC.toUTCString());
  console.log("Diferencia en días:", differenceInDays);

  // Permitir cancelar solo si la cita es al menos un día después de hoy
  return differenceInDays >= 1;*/
/*}*/
