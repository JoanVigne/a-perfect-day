import React, { useEffect, useState } from "react";
import FavoriteLists from "./FavoriteLists";
import TemporaryMessage from "./TemporaryMessage";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import TaskDisplay from "./TaskDisplay";

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
    const list = getItemFromLocalStorage("todayList");
    setTaskList(list);
    const updatedList = {
      ...list,
      [itemId]: {
        ...list[itemId],
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
              <div key={index}>
                <TaskDisplay
                  task={item}
                  inputCountUnit={true}
                  inputAdd={false}
                  theFunction={() => {
                    handleSave(item.id);
                    setClickedItemId(item.id);
                  }}
                  remove={true}
                  removeConfirmation={() => {
                    // remove de la list de la props ...
                    handleRemoveTaskFromTodayList(item.id);
                    setClickedIndex(null);
                  }}
                  handleCountInputChange={handleCountInputChange} // Ajout de cette prop
                  handleTaskCompletionToggle={handleTaskCompletionToggle}
                />
              </div>
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
    </div>
  );
};

export default Today;
