import React, { useEffect, useState } from "react";

import { fetchDataFromDBToLocalStorage } from "@/firebase/db/db";

interface CommonTasksProps {
  handleAddTaskToTodayList: (task: Task) => void;
}
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  count: any;
  unit: any;
}
const CommonTasks: React.FC<CommonTasksProps> = ({
  handleAddTaskToTodayList,
}) => {
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

  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  return (
    <ul>
      {commonTasks &&
        commonTasks.map((commonTask, index) => (
          <li className="task" key={index}>
            <div className="title-inputs">
              <h3>
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
              </h3>

              <img
                src="./add.png"
                className="add-button"
                alt="add"
                onClick={() => {
                  handleAddTaskToTodayList(commonTask);
                }}
              />
            </div>
            <div className="description-button">
              <p className="description">{commonTask.description}</p>
            </div>

            <div className={clickedIndex === index ? "active" : "hidden"}>
              <p>{commonTask.details}</p>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default CommonTasks;
