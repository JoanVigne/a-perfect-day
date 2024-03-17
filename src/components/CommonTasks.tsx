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
  const [messageAdded, setMessageAdded] = useState("");
  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);
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

  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  return (
    <ul>
      {commonTasks &&
        commonTasks.map((commonTask, index) => (
          /*  <li className="task" key={index}>
            <div className="title-inputs">
              <h4>
                {commonTask.name}
                <button
                  className="details"
                  onClick={() => {
                    setClickedIndex((prevIndex) =>
                      prevIndex === index ? null : index
                    );
                  }}
                >
                  {"?"}
                </button>
                {clickedItemIndex === index && (
                  <TemporaryMessage
                    message={messageAdded}
                    type="message-small"
                  />
                )}
              </h4>

              <img
                src="/add.png"
                className="add-button"
                alt="add"
                onClick={() => {
                  handleAddTask(commonTask);
                  setClickedItemIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                  setMessageAdded("added!");
                }}
              />
            </div>
            <div className="description-button"></div>

            <div className={clickedIndex === index ? "active" : "hidden"}>
              <h4 className="description">{commonTask.description}</h4>
              <p>{commonTask.details}</p>
            </div>
          </li> */
          <div key={index}>
            <TaskDisplay
              task={commonTask}
              theFunction={handleAddTask}
              inputCountUnit={false}
              inputSave={true}
              remove={false}
              removeConfirmation={false}
            />
          </div>
        ))}
    </ul>
  );
};

export default CommonTasks;
