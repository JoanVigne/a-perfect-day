import React, { useEffect, useState } from "react";

import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import FormCustomTask from "./FormCustomTask";
import { removeFromCustom } from "@/firebase/db/custom";
import Load from "./Load";

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

  const [messageCustom, setMessageCustom] = useState<string | null>(null);

  const [messageAdded, setMessageAdded] = useState("");
  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);

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

  // supprimer une custom :
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null);
  const handleRemoveTask = (task: Task) => {
    console.log("task ", task);
    setTaskToRemove(task);
    return;
  };
  const [forceUpdate, setForceUpdate] = useState(false);
  const handleConfirmRemoveTask = async () => {
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
      const mess = await removeFromCustom(updatedTasks, userId);
      setMessageCustom(mess);
      setCustomTasks(updatedTasks);
      setForceUpdate((prev) => !prev);
    }
  };

  // Reset messageAdded after a delay
  useEffect(() => {
    if (messageAdded) {
      const timeoutId = setTimeout(() => {
        setMessageAdded("");
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timeoutId);
    }
  }, [messageAdded]);

  return (
    <ul>
      {loadingTasks ? (
        <Load />
      ) : (
        customTasks &&
        Object.values(customTasks).map((customTask, index) => (
          <li className="task" key={index}>
            <div
              className="title-inputs"
              /* onClick={() => {
                  handleAddTaskToTodayList(customTask);
                }} */
            >
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
                {clickedItemIndex === index && (
                  <small className="message-small">{messageAdded}</small>
                )}
              </h3>

              <img
                onClick={() => {
                  handleAddTaskToTodayList(customTask);
                  setClickedItemIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );

                  setMessageAdded("added !");
                }}
                src="./add.png"
                alt="add"
                className="add-button"
              />
            </div>
            <div className={clickedIndex === index ? "active" : "hidden"}>
              <h4 className="description">{customTask.description}</h4>
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
      <small className="message-small">{messageCustom}</small>
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

      <FormCustomTask updateCustomTasks={updateCustomTasks} />
    </ul>
  );
};

export default CustomTasks;
