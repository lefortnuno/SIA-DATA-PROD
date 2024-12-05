// Fonction pour formater la date en "jour mois année"
export function formatDate(dateString) {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
 

export function formatHoursMin(timeString) {
  if (!timeString) {
    return "-";
  }
  const [hours, minutes] = timeString.split(":");

  if (hours && minutes) {
    return `${hours}h${minutes}`;
  }
  return "-";
}
 
 

