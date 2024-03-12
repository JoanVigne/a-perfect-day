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

//  function BOOLEAN OR NOT
interface HistoricData {
  [shortDate: string]: {
    date: string;
    [activityId: string]: Task | any;
  };
}
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  unit: string | boolean;
  count: string | number;
}
export function findTasksByType(data: HistoricData, type: string): string[] {
  const tasks: string[] = [];
  for (const date in data) {
    const day = data[date];
    for (const taskId in day) {
      const task = day[taskId];
      if (
        (type === "nonBoolean" && typeof task.unit !== "boolean") ||
        (type === "boolean" && typeof task.unit === "boolean")
      ) {
        if (task.name !== undefined && task.name !== null) {
          tasks.push(task.name);
        }
      }
    }
  }
  return Array.from(new Set(tasks));
}
