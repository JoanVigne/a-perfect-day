import React, { useEffect, useState } from "react";

interface Props {
  user: User | null;
}
interface User {
  nickname: string;
  lists: { [key: string]: object };
}

const FavoriteLists: React.FC<Props> = ({ user }) => {
  const [listOfLists, setListOfLists] = useState({});

  useEffect(() => {
    setListsWithLocalStorage();
    console.log("list of list dans favoriteLists: ", listOfLists);
    console.log("user dans favoriteLists :  ", user);
  }, []);

  function setListsWithLocalStorage() {
    let user = localStorage.getItem("users");
    const parsed = JSON.parse(user || "{}");
    setListOfLists(parsed.lists);
  }
  function listDetail(name: string) {
    if (user) {
      console.log("list : ", user.lists[name]);
      Object.values(user.lists[name]).forEach((element: any) => {
        console.log("element name: ", element.name);
      });
    }

    // envoyer avec la date du jour !
  }
  function removeList(listname: string) {
    // pour remove list de DB et local
    console.log(listname);
  }
  const [showFav, setShowFav] = useState(false);

  return (
    <>
      <div className="favorite-lists">
        <h3>
          Favorite lists :{" "}
          <button
            className={`${showFav ? "hide" : "add"}`}
            onClick={() => setShowFav(!showFav)}
          >
            {showFav ? "Hide favorites" : "Show favorites"}
          </button>
        </h3>
        <div className={`smaller-container ${showFav ? "active" : "hidden"}`}>
          <h3>Excisting favorites : </h3>
          <ul>
            {user &&
              Object.keys(user.lists).map((listName: string, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <li>
                      {listName}
                      <button
                        className="add"
                        onClick={() => {
                          listDetail(listName);
                        }}
                      >
                        Use
                      </button>
                      <span
                        className="remove"
                        onClick={() => {
                          removeList(listName);
                        }}
                      >
                        <img src="./delet.png" alt="remove" />
                      </span>
                    </li>
                  </React.Fragment>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FavoriteLists;
