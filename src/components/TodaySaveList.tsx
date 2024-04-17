import React, { useEffect, useState } from "react";
import { sendToUsers } from "@/firebase/db/users";
import IconOpen from "./ui/IconOpen";

interface TodaySaveListProps {
  taskList: object;
  userid: string;
}
const TodaySaveList: React.FC<TodaySaveListProps> = ({ taskList, userid }) => {
  const [listOfLists, setListOfLists] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setListsWithLocalStorage();
  }, []);
  function handleSubmitNewFavList(e: React.FormEvent<HTMLFormElement>) {
    /*    e.preventDefault(); , pour refresh la page, car les listes en bas ne se mettent pas a jour*/
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
    /*     const newFavList = { ...userList, [nameOfNewFav]: taskList }; */
    const newFavList = {
      ...userList,
      [nameOfNewFav]: Object.entries(taskList).reduce((acc, [key, value]) => {
        if (key !== "date") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
    };

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
  function setListsWithLocalStorage() {
    let user = localStorage.getItem("users");
    const parsed = JSON.parse(user || "{}");
    setListOfLists(parsed.lists);
  }
  function updateThisFav(name: string): void {
    console.log("list", name);
    let user = localStorage.getItem("users");
    let userList: { [listname: string]: object } = {};
    if (user) {
      userList = JSON.parse(user).lists || {};
    }
    console.log("userList", userList);
    Object.keys(userList).map((key) => {
      if (name === key) {
        userList[key] = taskList;
      }
    });
    setMessage(`fav list "${name}" modified`);
  }

  return (
    <>
      <IconOpen show={showForm} setShow={setShowForm} />
      {/*  <button
        className={`${showForm ? "hide" : "add"}`}
        onClick={() => {
          setShowForm(!showForm);
          setMessage("");
        }}
      >
        {showForm ? "Hide this " : "add to favorite"}
      </button> */}
      {message && message}
      <div className={showForm ? "active" : "hidden"}>
        <div className="container-save-list">
          <div className="lists">
            {listOfLists && Object.keys(listOfLists).length === 0 && (
              <p>No favorite list yet</p>
            )}
            <ul>
              {listOfLists &&
                Object.keys(listOfLists).map((key, index) => (
                  <li key={index}>
                    <div className="text-container">
                      <strong>{key}</strong>
                    </div>
                    <button
                      className="message-error"
                      onClick={() => updateThisFav(key)}
                    >
                      update
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <form action="" onSubmit={(e) => handleSubmitNewFavList(e)}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="new list ?"
            required
          />
          <input type="submit" value="save" className="save" />
        </form>
      </div>
    </>
  );
};

export default TodaySaveList;
