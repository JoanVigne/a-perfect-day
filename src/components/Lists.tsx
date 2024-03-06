import React, { useEffect, useState } from "react";
import FavoriteLists from "./FavoriteLists";

interface User {
  nickname: string;
  lists: { [key: string]: object };
}

interface Props {
  userInfo: User;
}
const Lists: React.FC<Props> = ({ userInfo }) => {
  const [custom, setCustom] = useState();
  const [common, setCommon] = useState();

  const [showForm, setShowForm] = useState(false);
  const [newFav, setNewFav] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    console.log(userInfo);
    // get les listes de tasks
    const localCustom = localStorage.getItem("custom") as string;
    const localCommon = localStorage.getItem("common") as string;
    setCustom(JSON.parse(localCustom));
    setCommon(JSON.parse(localCommon));
    // la liste
  }, []);

  function listDetail(name: string) {
    if (userInfo) {
      console.log("list : ", userInfo.lists[name]);
      Object.values(userInfo.lists[name]).forEach((element: any) => {
        console.log("element name: ", element.name);
      });
    }

    // envoyer avec la date du jour !
  }

  function createANewFavoriteList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const name: string = target.name.value;

    console.log("nme : ", name);
    console.log("newFav", newFav);
    // envoyer dans local et db
  }
  /*   function removeList(listname: string) {
    // pour remove list de DB et local
    console.log(listname);
    console.log("user : ", user);
    if (user) {
      console.log("list : ", user.lists[name]);
      Object.values(user.lists[name]).forEach((element: any) => {
        console.log("element name: ", element.name);
      });
    }
  } */

  return (
    <div className="container">
      <FavoriteLists useOnOff={false} deleteOnOff={true} />
      <div className="container-new-fav-list">
        <h3>
          New favorite list :
          <button
            className={`${showForm ? "" : "add"}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide new fav" : "New favorite"}
          </button>
        </h3>
        <div
          className={
            showForm ? "container-form active" : "container-form hidden"
          }
        >
          <div className="new-fav-list container">
            <ul>
              {newFav ? (
                Object.values(newFav).map((ele: any, index: number) => {
                  return (
                    <li key={index}>
                      {ele.name}{" "}
                      <button
                        className=""
                        onClick={() => {
                          setNewFav((prevState) => {
                            const newState = { ...prevState };
                            delete newState[ele.id];
                            console.log(newState);
                            return newState;
                          });
                        }}
                      >
                        {" "}
                        -{" "}
                      </button>
                    </li>
                  );
                })
              ) : (
                <p>
                  Here will be the tasks you want to add to your new favorite
                  list
                </p>
              )}
            </ul>
            {newFav && Object.keys(newFav).length === 0 ? (
              <p>Add some tasks from the lists below</p>
            ) : (
              <form action="" onSubmit={createANewFavoriteList}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="name of your new list"
                />
                <button type="submit" className="add">
                  Create Favorite
                </button>
              </form>
            )}
          </div>
          <div className="container-column">
            <div className="custom">
              <h3>Custom</h3>
              <ul>
                {custom &&
                  Object.values(custom).map((ele: any, index: number) => {
                    return (
                      <li key={index}>
                        {ele.name}
                        <button
                          className="add"
                          onClick={() => {
                            setNewFav((prevState) => ({
                              ...prevState,
                              [ele.id]: ele,
                            }));
                          }}
                        >
                          add
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="common">
              <h3>Common</h3>
              <ul>
                {common &&
                  Object.values(common).map((ele: any, index: number) => {
                    return (
                      <li key={index}>
                        {ele.name}
                        <button
                          className="add"
                          onClick={() => {
                            setNewFav((prevState) => ({
                              ...prevState,
                              [ele.id]: ele,
                            }));
                          }}
                        >
                          add
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lists;
