import React, { useEffect, useState } from "react";
import "./lists.css";

interface User {
  nickname: string;
  lists: { [key: string]: object };
}

interface Props {
  user: User;
}
const Lists: React.FC<Props> = ({ user }) => {
  const [custom, setCustom] = useState();
  const [common, setCommon] = useState();

  const [showForm, setShowForm] = useState(false);
  const [newFav, setNewFav] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const localCustom = localStorage.getItem("custom") as string;
    const localCommon = localStorage.getItem("common") as string;

    setCustom(JSON.parse(localCustom));
    setCommon(JSON.parse(localCommon));
  }, []);

  function listDetail(name: string) {
    if (user) {
      console.log("list : ", user.lists[name]);
      Object.values(user.lists[name]).forEach((element: any) => {
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
  function removeList(listname: string) {
    // pour remove list de DB et local
    console.log(listname);
  }

  return (
    <div className="container">
      <h2>Favorite Lists</h2>
      <div className="container smaller-container">
        <h3>Excisting favorites : </h3>
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
                    <img src="./red-bin.png" alt="remove" />
                  </span>
                </li>
              </React.Fragment>
            );
          })}
      </div>
      <div className="container-new-fav-list">
        <button
          className={`${showForm ? "" : "add"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide new fav" : "New favorite"}
        </button>
        <div className={showForm ? "cont-form opened" : "cont-form"}>
          <div className="new-fav-list container">
            <h3>New favorite list :</h3>
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
            {Object.keys(newFav).length === 0 ? (
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
