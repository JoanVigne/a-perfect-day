import React, { useEffect, useState } from "react";
import "./commonTasks.css";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/config";
import FormCustomTask from "./FormCustomTask";

interface CustomTasksProps {
  handleAddTaskToTodayList: (task: Task) => void;
  userId: string;
}
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  count: any;
  unit: any;
}
const CustomTasks: React.FC<CustomTasksProps> = ({
  handleAddTaskToTodayList,
  userId,
}) => {
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  useEffect(() => {
    console.log("user dans custom : ", userId);
    const fetchData = async () => {
      try {
        const fetching = await fetchOnlyThisIdToLocalStorage("custom", userId);
        setCustomTasks(fetching);
        setLoadingTasks(false);
      } catch (error) {
        console.error("Error fetching custom tasks:", error);
        setLoadingTasks(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("CUSTOM TASKS", customTasks);
  }, [customTasks]);
  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  // ouvrir et fermer le form :
  const [showForm, setShowForm] = useState(false);
  return (
    <ul>
      {loadingTasks ? (
        <li>Loading...</li>
      ) : (
        customTasks &&
        Object.values(customTasks).map((customTask, index) => (
          <li className="task" key={index}>
            <div
              className="name-button"
              onClick={() => {
                handleAddTaskToTodayList(customTask);
              }}
            >
              {customTask.name}
              <button>add</button>
            </div>
            <div className="description-button">
              <p className="description">{customTask.description}</p>
              <button
                onClick={() => {
                  setClickedIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                }}
              >
                {">"}
              </button>
            </div>

            <div className={clickedIndex === index ? "active" : "hidden"}>
              <p>{customTask.details}</p>
            </div>
          </li>
        ))
      )}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Create a new task"}
      </button>
      {showForm && <FormCustomTask />}
    </ul>
  );
};

export default CustomTasks;
