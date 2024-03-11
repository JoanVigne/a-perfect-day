export function findTask(data: any, task: string) {
  for (let i = 0; i < data.length; i++) {
    const dayData = data[i];
    for (const key in dayData) {
      if (Object.prototype.hasOwnProperty.call(dayData, key)) {
        const nestedData = dayData[key];
        if (
          nestedData &&
          nestedData.hasOwnProperty("name") &&
          nestedData.name === task
        ) {
          return nestedData.id;
        }
      }
    }
  }
  return false; // La tâche n'est pas trouvée dans les données
}
