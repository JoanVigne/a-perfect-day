import React, { useEffect, useState } from "react";
import "./commonTasks.css";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import FormCustomTask from "./FormCustomTask";
import { removeFromCustom } from "@/firebase/db/custom";

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

  const updateCustomTasks = (newCustomTasks: Task[]) => {
    setCustomTasks(newCustomTasks);
  };

  const [loadingTasks, setLoadingTasks] = useState(true);
  useEffect(() => {
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

  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  // ouvrir et fermer le form :
  const [showForm, setShowForm] = useState(false);

  // supprimer une custom :
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null);
  const handleRemoveTask = (task: Task) => {
    console.log("task ", task);
    setTaskToRemove(task);
    return;
  };
  const handleConfirmRemoveTask = () => {
    if (taskToRemove && taskToRemove.id !== undefined) {
      // Créer une copie de customTasks
      const updatedTasks = { ...customTasks };

      // Supprimer la tâche avec l'ID correspondant de la copie de customTasks
      Object.keys(updatedTasks).forEach((key) => {
        const taskKey = key as keyof typeof updatedTasks;
        if (taskKey === taskToRemove?.id) {
          delete updatedTasks[taskKey];
        }
      });

      setTaskToRemove(null);
      // envoi a la db custom
      removeFromCustom(updatedTasks, userId);
      setCustomTasks(updatedTasks);
    }
  };

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
              /* onClick={() => {
                  handleAddTaskToTodayList(customTask);
                }} */
            >
              <div className="name-details">
                <h3>
                  {customTask.name}
                  <button
                    className="details"
                    onClick={() => {
                      setClickedIndex((prevIndex) =>
                        prevIndex === index ? null : index
                      );
                    }}
                  >
                    ?
                  </button>
                </h3>
              </div>

              <button
                className="add"
                onClick={() => {
                  handleAddTaskToTodayList(customTask);
                }}
              >
                +
              </button>
            </div>
            <div className="description-button"></div>

            <div className={clickedIndex === index ? "active" : "hidden"}>
              <p className="description">{customTask.description}</p>
              <p>{customTask.details}</p>

              <span
                className="remove"
                onClick={() => {
                  handleRemoveTask(customTask);
                }}
              >
                <img src="./red-bin.png" alt="remove" />
              </span>
            </div>
          </li>
        ))
      )}
      {taskToRemove && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmRemoveTask}>Confirm</button>
              <button onClick={() => setTaskToRemove(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <button
        className={`${showForm ? "" : "add"}`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Hide Form" : "New task"}
      </button>
      <div className={showForm ? "cont-form opened" : "cont-form"}>
        <FormCustomTask updateCustomTasks={updateCustomTasks} />
      </div>
    </ul>
  );
};

export default CustomTasks;
