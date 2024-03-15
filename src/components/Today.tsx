import React, { useEffect, useState } from "react";
import FavoriteLists from "./FavoriteLists";
import TemporaryMessage from "@/app/utils/message";

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
  userInfo: User | null;
  userId: string;
}
interface User {
  nickname: string;
  lists: { [key: string]: object };
}
const Today: React.FC<TodayProps> = ({
  list,
  handleRemoveTaskFromTodayList,
  userInfo,
  userId,
}) => {
  useEffect(() => {
    setTaskList(list);
  }, [list]);

  const [taskList, setTaskList] = useState<{ [key: string]: Task }>(list);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  // set message when click save
  const [messageSaved, setMessageSaved] = useState("");
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);

  function updateTaskList(newList: any) {
    if (false) {
      return;
    } else {
      setTaskList(newList);
    }
  }
  const [countInputValues, setCountInputValues] = useState<{
    [key: string]: string;
  }>({});
  const handleCountInputChange = (itemId: string, value: string) => {
    setCountInputValues((prevValues) => ({
      ...prevValues,
      [itemId]: value,
    }));
  };

  // que dans le localStorage
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
    setMessageSaved("saved !");
  };

  // que dans le localStorage
  const handleSave = (itemId: string) => {
    const updatedList = {
      ...taskList,
      [itemId]: {
        ...taskList[itemId],
        count: countInputValues[itemId] || "0",
      },
    };
    setTaskList(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
    setMessageSaved("saved !");
  };

  return (
    <div className="today-list">
      <ul>
        {taskList &&
          Object.values(taskList).map((item, index) => {
            if (Object.keys(taskList).length <= 0) {
              return (
                <p key={index}>
                  Your list is empty. You can add some tasks from the common
                  task list, or from your custom task list.
                </p>
              );
            }
            // Si la clé est "date", on ne l'affiche pas
            if (typeof item === "string") {
              return null;
            }
            return (
              <li
                key={item.id}
                className={
                  item.unit === false || item.count === "0"
                    ? "task"
                    : "task task-done"
                }
              >
                <div className="title-inputs">
                  <h4>
                    {item.name}

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
                    {clickedItemId === item.id && (
                      <TemporaryMessage message={messageSaved} />
                    )}
                  </h4>{" "}
                  <div className="count">
                    {typeof item.unit === "boolean" ? (
                      <button
                        onClick={() => {
                          handleTaskCompletionToggle(item.id);
                          setClickedItemId(item.id);
                        }}
                        className={item.unit === false ? "save" : "undo"}
                      >
                        {item.unit === false ? "Done?" : "undo"}
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
                          <p className="unit"> {item.unit}</p>
                        </div>
                        <button
                          className="save"
                          onClick={() => {
                            handleSave(item.id);
                            setClickedItemId(item.id);
                          }}
                        >
                          save
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className={clickedIndex === index ? "active" : "hidden"}>
                  <h4>{item.description}</h4>
                  <p>{item.details}</p>
                  <span
                    className="remove"
                    onClick={() => {
                      // remove de la list de la props ...
                      handleRemoveTaskFromTodayList(item.id);
                      setClickedIndex(null);
                    }}
                  >
                    <img src="./red-bin.png" alt="remove" />
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
      <FavoriteLists
        setTodayList={updateTaskList}
        useOnOff={true}
        deleteOnOff={false}
        userInfo={userInfo}
        /*        functionSetUserInfo={functionSetUserInfo} */
      />

      {/*      <button className="add" onClick={sendListToUserTodayList}>
        save to db(if you logout)
      </button> */}
      {/*     <p className="message-small"> {messageInfoDB}</p> */}

      {/*    <TodaySaveList taskList={taskList} userid={userId} /> */}
    </div>
  );
};

export default Today;
