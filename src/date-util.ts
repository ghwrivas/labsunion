export function getWeekDay(strDate) {
  const date = new Date(strDate);
  switch (date.getUTCDay()) {
    case 0:
      return "Domingo";
    case 1:
      return "Lunes";
    case 2:
      return "Martes";
    case 3:
      return "Miercoles";
    case 4:
      return "Jueves";
    case 5:
      return "Viernes";
    case 6:
      return "Sabado";
    default:
      return "";
  }
}

export function getMonth(strDate) {
  const date = new Date(strDate);
  switch (date.getUTCMonth()) {
    case 0:
      return "Enero";
    case 1:
      return "Febrero";
    case 2:
      return "Marzo";
    case 3:
      return "Abril";
    case 4:
      return "Mayo";
    case 5:
      return "Junio";
    case 6:
      return "Julio";
    case 7:
      return "Agosto";
    case 8:
      return "Septiembre";
    case 9:
      return "Octubre";
    case 10:
      return "Noviembre";
    case 11:
      return "Diciembre";
    default:
      return "";
  }
}

export function getFormattedDate(strDate) {
  const date = new Date(strDate);
  return `${date.getUTCDate()} de ${getMonth(strDate)}`;
}
