export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options = { month: "long" as const, day: "2-digit" as const };
  return date.toLocaleDateString("fr-FR", options); // Vous pouvez ajuster le local selon vos besoins
}
