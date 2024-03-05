import React, { useEffect, useState } from "react";
import "./today.css";
import { checkDB } from "@/firebase/db/db";
import { setDoc } from "firebase/firestore";
import TodaySaveList from "./TodaySaveList";
import { sendToHistoric } from "@/firebase/db/historic";
import FavoriteLists from "./FavoriteLists";

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
  user: User | null;
  userId: string;
}
interface User {
  nickname: string;
  lists: { [key: string]: object };
}
const Today: React.FC<TodayProps> = ({
  list,
  handleRemoveTaskFromTodayList,
  user,
  userId,
}) => {
  useEffect(() => {
    setTaskList(list);
  }, [list]);

  const [taskList, setTaskList] = useState<{ [key: string]: Task }>(list);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const [countInputValues, setCountInputValues] = useState<{
    [key: string]: string;
  }>({});
  const handleCountInputChange = (itemId: string, value: string) => {
    setCountInputValues((prevValues) => ({
      ...prevValues,
      [itemId]: value,
    }));
  };
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
    // to db ?
  };
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
    console.log(updatedList);
    setMessageSaved("saved !");
  };

  const [countCalls, setCountcalls] = useState(0);
  const [messageInfoDB, setMessageInfoDB] = useState("");
  /*   async function sendListToUserTodayList() {
    setMessageInfoDB("");
    setCountcalls(countCalls + 1);
    console.log(countCalls);
    if (countCalls >= 3) {
      setMessageInfoDB("Already saved twice.");
      return "too many calls";
    }
    const { ref, snapShot } = await checkDB("users", userId);
    if (!snapShot.exists()) {
      console.log("id utilisateur introuvable dans collection historic");
      return;
    }
    console.log(snapShot.data());
    const todayList = taskList;

    const newData = { ...snapShot.data(), todayList };
    await setDoc(ref, newData);
    console.log("data envoyé");
    setMessageInfoDB("today list sent to");
    return "today list sent to db in users";
  } */
  const [messageSaved, setMessageSaved] = useState("");
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  return (
    <div className="today-list">
      {/* <button
        onClick={() => {
          sendListToUserTodayList();
        }}
      >
        Test
      </button> */}
      <ul>
        {taskList &&
          Object.values(taskList).map((item, index) => {
            if (Object.keys(taskList).length <= 1) {
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
              <li key={item.id} className="task">
                <div className="title-inputs">
                  <h3>
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
                      <small className="message-small">{messageSaved}</small>
                    )}
                  </h3>{" "}
                  <div className="count">
                    {typeof item.unit === "boolean" ? (
                      <button
                        onClick={() => {
                          handleTaskCompletionToggle(item.id);
                          setClickedItemId(item.id);
                        }}
                        className={
                          item.unit === false
                            ? "task-not-done save"
                            : "task-done undo"
                        }
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
                    }}
                  >
                    <img src="./red-bin.png" alt="remove" />
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
      <FavoriteLists user={user} />

      {/*      <button className="add" onClick={sendListToUserTodayList}>
        save to db(if you logout)
      </button> */}
      {/*     <p className="message-small"> {messageInfoDB}</p> */}

      {/*    <TodaySaveList taskList={taskList} userid={userId} /> */}
    </div>
  );
};

export default Today;
