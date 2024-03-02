import React, { useEffect, useState } from "react";
import { sendToUsers } from "@/firebase/db/users";

interface TodaySaveListProps {
  taskList: object;
  userid: string;
}
const TodaySaveList: React.FC<TodaySaveListProps> = ({ taskList, userid }) => {
  const [listOfLists, setListOfLists] = useState({});

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

  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <button
        className={`${showForm ? "" : "add"}`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Hide this " : "add to favorite"}
      </button>
      <div className={showForm ? "cont-form opened" : "cont-form"}>
        <div className="container-save-list">
          <div className="lists">
            {listOfLists && Object.keys(listOfLists).length === 0 && (
              <p>No favorite list yet</p>
            )}
            <ul>
              {listOfLists &&
                Object.keys(listOfLists).map((key, index) => (
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
            <input type="submit" value="save this list" />
          </form>
        </div>
      </div>
    </>
  );
};

export default TodaySaveList;
