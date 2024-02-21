import React, { useEffect, useState } from "react";
import "./commonTasks.css";
import { fetchDataFromDBToLocalStorage } from "@/firebase/config";

interface CommonTasksProps {
  handleAddTaskToTodayList: (task: {
    name: string;
    description: string;
    details: string;
  }) => void;
}
const CommonTasks: React.FC<CommonTasksProps> = ({
  handleAddTaskToTodayList,
}) => {
  const [commonTasks, setCommonTasks] = useState<
    { name: string; description: string; details: string }[]
  >([]);
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
            <div
              className="name-button"
              onClick={() => {
                handleAddTaskToTodayList(commonTask);
              }}
            >
              {commonTask.name}
              <button>add</button>
            </div>
            <div className="description-button">
              <p className="description">{commonTask.description}</p>
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
              <p>{commonTask.details}</p>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default CommonTasks;
