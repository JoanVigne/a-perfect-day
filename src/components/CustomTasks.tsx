import React, { useEffect, useState } from "react";

import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import FormCustomTask from "./FormCustomTask";
import { removeFromCustom } from "@/firebase/db/custom";
import Load from "./Load";
import TemporaryMessage from "./TemporaryMessage";
import TaskDisplay from "./TaskDisplay";

interface CustomTasksProps {
  handleAddTask: (task: Task) => void;
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
const CustomTasks: React.FC<CustomTasksProps> = ({ handleAddTask, userId }) => {
  const [customTasks, setCustomTasks] = useState<Task[]>([]);

  const [messageCustom, setMessageCustom] = useState<string | null>(null);

  const [messageAdded, setMessageAdded] = useState("");
  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);

  const updateCustomTasks = (newCustomTasks: Task[]) => {
    setCustomTasks(newCustomTasks);
    localStorage.setItem("custom", JSON.stringify(newCustomTasks));
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
  /*   const [clickedIndex, setClickedIndex] = useState<number | null>(null); */

  // supprimer une custom :
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null);
  const handleRemoveTask = (task: Task, index: number) => {
    setClickedItemIndex((prevIndex) => (prevIndex === index ? null : index));
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
      console.log("updated Task", updatedTasks);
      setTaskToRemove(null);
      // envoi a la db custom
      const mess = await removeFromCustom(updatedTasks, userId);
      setMessageCustom(mess);
      setCustomTasks(updatedTasks);
      setForceUpdate((prev) => !prev);
    }
  };

  return (
    <ul>
      {loadingTasks ? (
        <Load />
      ) : (
        customTasks &&
        Object.values(customTasks).map((customTask, index) => (
          /*           <li className="task" key={index}>
            <div
              className="title-inputs"
            >
              <h4>
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
                  <TemporaryMessage
                    message={messageAdded}
                    type="message-small"
                  />
                )}
              </h4>

              <img
                onClick={() => {
                  handleAddTask(customTask);
                  setClickedItemIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );

                  setMessageAdded("added!");
                }}
                src="/add.png"
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
                  setClickedItemIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                }}
              >
                <img src="/red-bin.png" alt="remove" />
              </span>
              {clickedItemIndex === index && taskToRemove && (
                <div className="modal-remove">
                  <div className="modal-content">
                    <p>
                      Are you sure you want to delete "{customTask.name}" for
                      ever ?
                    </p>
                    <div className="modal-buttons">
                      <button
                        onClick={handleConfirmRemoveTask}
                        className="confirm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setTaskToRemove(null)}
                        className="cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li> */
          <div key={index}>
            <TaskDisplay
              task={customTask}
              inputCountUnit={false}
              inputSave={true}
              theFunction={handleAddTask}
              remove={true}
              removeConfirmation={() => handleRemoveTask(customTask, index)}
            />
            {clickedItemIndex === index && taskToRemove && (
              <div className="modal-remove">
                <div className="modal-content">
                  <p>
                    Are you sure you want to delete "{customTask.name}" for ever
                    ?
                  </p>
                  <div className="modal-buttons">
                    <button
                      onClick={handleConfirmRemoveTask}
                      className="confirm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setTaskToRemove(null)}
                      className="cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
      <TemporaryMessage message={messageCustom} type="message-small" />
      <FormCustomTask updateCustomTasks={updateCustomTasks} />
    </ul>
  );
};

export default CustomTasks;
