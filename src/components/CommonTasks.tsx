import React, { useEffect, useState } from "react";

import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";
import TemporaryMessage from "./TemporaryMessage";
import TaskDisplay from "./TaskDisplay";

interface CommonTasksProps {
  handleAddTask: (task: Task) => void;
}
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  count: any;
  unit: any;
}
const CommonTasks: React.FC<CommonTasksProps> = ({ handleAddTask }) => {
  const [commonTasks, setCommonTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetching = await fetchDataFromDBToLocalStorage("common");
        setCommonTasks(fetching);
      } catch (error) {
        console.error("Error fetching common tasks:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul>
      {commonTasks &&
        commonTasks.map((commonTask, index) => (
          <div key={index}>
            <TaskDisplay
              task={commonTask}
              theFunction={handleAddTask}
              inputCountUnit={false}
              inputAdd={true}
              remove={false}
              removeConfirmation={false}
              handleCountInputChange={false}
              handleTaskCompletionToggle={false}
            />
          </div>
        ))}
    </ul>
  );
};

export default CommonTasks;
