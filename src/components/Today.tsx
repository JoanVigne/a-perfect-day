import React, { useContext, useEffect, useRef, useState } from "react";
import "./today.css";
import { checkDB } from "@/firebase/db/db";
import { AuthContext } from "@/context/AuthContext";
import { setDoc } from "firebase/firestore";
import resetListToFalseAndZero from "@/app/utils/reset";
import { sendToUsers } from "@/firebase/db/users";

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
  userid: string;
}

const Today: React.FC<TodayProps> = ({
  list,
  handleRemoveTaskFromTodayList,
  userid,
}) => {
  useEffect(() => {
    setTaskList(list);
  }, [list]);

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

  const handleSave = (itemId: string) => {
    const updatedList = {
      ...taskList,
      [itemId]: {
        ...taskList[itemId],
        count: countInputValues[itemId] || "0",
      },
    };
    setTaskList(updatedList);
    console.log(updatedList);

    // et envoyer dans la DB la liste du jour:
    /*  sendTodayListToDB(updatedList); */
  };
  async function sendTodayListToDB(data: any) {
    const waitingHistoric = localStorage.getItem("waitingHistoric");
    if (!navigator.onLine) {
      //hors ligne
      if (!waitingHistoric) {
        localStorage.setItem("waitingHistoric", JSON.stringify(data));
      }
      if (waitingHistoric) {
        const copyWaitingHistoric = JSON.parse(waitingHistoric);
        copyWaitingHistoric.push(data);
        localStorage.setItem(
          "waitingHistoric",
          JSON.stringify(copyWaitingHistoric)
        );
      }
      resetListToFalseAndZero(data);
      return data;
    }
    const { ref, snapShot } = await checkDB("users", userid);
    if (!snapShot.exists()) {
      console.log("id utilisateur introuvable dans collection historic");
      return;
    }
    if (waitingHistoric) {
      // envoyer a db
      const copyWaitingHistoric = JSON.parse(waitingHistoric);
      const newData = { ...snapShot.data(), copyWaitingHistoric };
      await setDoc(ref, newData);
      localStorage.removeItem("waitingHistoric");
    }
    const todayList = data;
    const newData = { ...snapShot.data(), todayList };
    await setDoc(ref, newData);
    localStorage.setItem("todayList", JSON.stringify(todayList));
  }

  const [listOfLists, setListOfLists] = useState({});
  useEffect(() => {
    setListsWithLocalStorage();
  }, []);
  function openFavListForm() {}

  function handleSubmitNewFavList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nameOfNewFav =
      (e.currentTarget.elements.namedItem("name") as HTMLInputElement | null)
        ?.value || "";
    if (nameOfNewFav === "") {
      return "empty name not possible";
    }
    console.log("nameOfNewFav", nameOfNewFav);
    let user = localStorage.getItem("users");
    let userList = {};
    if (user) {
      userList = JSON.parse(user).lists;
      console.log("userList", userList);
    }

    const newFavList = { ...userList, [nameOfNewFav]: taskList };
    console.log("newFavList", newFavList);
    const updatedUser = {
      ...JSON.parse(user || "{}"),
      lists: newFavList,
    };
    /*     setListOfLists(newFavList); */
    localStorage.setItem("users", JSON.stringify(updatedUser));
    e.currentTarget.reset();
    // fonction pour envoyer a la DB
    sendToUsers(updatedUser, userid);
    setListsWithLocalStorage();
  }

  function updateThisFav(list: any) {
    console.log("list", list);
    let user = localStorage.getItem("users");
    let userList;
    if (user) {
      userList = JSON.parse(user).lists;
    }
    console.log("userList", userList);
    Object.keys(userList).map((key) => {
      console.log("key : ", key);
      if (list === key) {
        // replace this object userList[key] par list
      }
    });
  }
  function setListsWithLocalStorage() {
    let user = localStorage.getItem("users");
    const parsed = JSON.parse(user || "{}");
    setListOfLists(parsed.lists);
  }
  // ouvrir et fermer la description :
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  return (
    <div className="today-list">
      <h2>today's list</h2>
      <button onClick={setListsWithLocalStorage}>Test</button>
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
                      className="details"
                      onClick={() => {
                        setClickedIndex((prevIndex) =>
                          prevIndex === index ? null : index
                        );
                      }}
                    >
                      ?
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
                          }}
                        >
                          save
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className={clickedIndex === index ? "active" : "hidden"}>
                  <strong>{item.description}</strong>
                  <br />
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
      <div className="container-save-list">
        {/* Button pour ouvrir et fermer lists */}
        <button onClick={openFavListForm}>Save to your favorite lists</button>

        <div className="lists">
          {listOfLists && Object.keys(listOfLists).length === 0 && (
            <p>No favorite list yet</p>
          )}
          <ul>
            {Object.keys(listOfLists).map((key, index) => (
              <li key={index}>
                <strong>{key}</strong>
                <button onClick={() => updateThisFav(key)}>update</button>
              </li>
            ))}
          </ul>
        </div>
        <form action="" onSubmit={(e) => handleSubmitNewFavList(e)}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="name of the new favorite list"
            required
          />
          <input type="submit" value="create new list" />
        </form>
      </div>
    </div>
  );
};

export default Today;
