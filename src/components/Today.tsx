import React, { useEffect, useRef, useState } from "react";
import "./today.css";

interface Task {
  unit: boolean | string;
  details: string;
  description: string;
  count: number | string;
  name: string;
  id: string;
}
interface TodayProps {
  list: { [key: string]: any };
  handleRemoveTaskFromTodayList: any;
}

const Today: React.FC<TodayProps> = ({
  list,
  handleRemoveTaskFromTodayList,
}) => {
  useEffect(() => {
    setTaskList(list);
  }, [list]);
  // remettre a 0 ?

  //
  const [taskList, setTaskList] = useState<{ [key: string]: Task }>(list);

  const handleTaskCompletionToggle = (itemId: string) => {
    const updatedList = {
      ...taskList,
      [itemId]: {
        ...taskList[itemId],
        unit: !taskList[itemId].unit,
      },
    };
    setTaskList(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
  };

  const [countInputValues, setCountInputValues] = useState<{
    [key: string]: string;
  }>({});
  const handleCountInputChange = (itemId: string, value: string) => {
    setCountInputValues((prevValues) => ({
      ...prevValues,
      [itemId]: value,
    }));
  };

  const handleSaveCount = (itemId: string) => {
    const updatedList = {
      ...taskList,
      [itemId]: {
        ...taskList[itemId],
        count: countInputValues[itemId] || "0",
      },
    };
    setTaskList(updatedList);
    console.log(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
  };

  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  return (
    <div className="today-list">
      <h2>today's list</h2>
      <ul>
        {taskList &&
          Object.values(taskList).map((item, index) => {
            // Si la clé est "date", on ne l'affiche pas
            if (typeof item === "string") {
              return null;
            }
            return (
              <li key={item.id} className="item">
                <div className="title-count">
                  <h3>
                    {item.name}
                    <button
                      onClick={() => {
                        setClickedIndex((prevIndex) =>
                          prevIndex === index ? null : index
                        );
                      }}
                    >
                      details
                    </button>
                  </h3>{" "}
                  <div className="count">
                    {typeof item.unit === "boolean" ? (
                      <button
                        onClick={() => {
                          handleTaskCompletionToggle(item.id);
                          /*      handleClickCount(item.id); */
                        }}
                        className={
                          item.unit === false ? "task-not-done" : "task-done"
                        }
                      >
                        {item.unit === false ? "Done?" : "V"}
                      </button>
                    ) : (
                      <>
                        <div className="container-count-unit">
                          <input
                            type="number"
                            name={`count-${item.id}`}
                            id={`count-${item.id}`}
                            value={countInputValues[item.id] || ""}
                            onChange={(e) =>
                              handleCountInputChange(item.id, e.target.value)
                            }
                            placeholder={String(item.count)}
                          />
                          {item.unit}
                        </div>
                        <button
                          onClick={() => {
                            handleSaveCount(item.id);
                          }}
                        >
                          enregistrer
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className={clickedIndex === index ? "active" : "hidden"}>
                  <strong>{item.description}</strong>
                  <br /> {item.details}
                  <span
                    className="remove"
                    onClick={() => {
                      // remove de la list de la props ...
                      handleRemoveTaskFromTodayList(item.id);
                    }}
                  >
                    remove
                  </span>
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Today;
