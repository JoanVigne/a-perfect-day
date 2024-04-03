import React, { useEffect, useState } from "react";
import FavoriteLists from "./FavoriteLists";
import TemporaryMessage from "./TemporaryMessage";
import OpenIcon from "./OpenIcon";

interface UserInfo {
  nickname: string;
  lists: { [key: string]: object };
  todayList: { [key: string]: object };
}

interface Props {
  userInfo: UserInfo;
  functionSetUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}
const Lists: React.FC<Props> = ({ userInfo, functionSetUserInfo }) => {
  const [custom, setCustom] = useState();
  const [common, setCommon] = useState();

  const [showForm, setShowForm] = useState(false);
  const [newFav, setNewFav] = useState<{ [key: string]: any }>({});

  const [message, setMessage] = useState("");

  useEffect(() => {
    // get les listes de tasks
    const localCustom = localStorage.getItem("custom") as string;
    const localCommon = localStorage.getItem("common") as string;
    setCustom(JSON.parse(localCustom));
    setCommon(JSON.parse(localCommon));
    // la liste
  }, [userInfo]);

  function createANewFavoriteList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const name: string = target.name.value;

    if (name.length === 0) {
      setMessage("Please name this list");
      return "name.length === 0";
    }
    if (userInfo.lists.hasOwnProperty(name)) {
      setMessage("This name is already taken");
      // Affichez un message d'erreur ou effectuez une action appropriée
      return "This name is already taken";
    }
    const updatedUserInfo = {
      ...userInfo,
      lists: {
        ...userInfo.lists,
        [name]: newFav,
      },
    };
    functionSetUserInfo(updatedUserInfo);
    localStorage.setItem("users", JSON.stringify(updatedUserInfo));
    // quand envoyer dans db ???
    // to db : NEED USER UID
    /*         let dataSent = await sendToUsers(updatedUserInfo, user.uid);
        if (!dataSent) {
          setMessageDelete("fail to delete");
          return "fail to delete";
        } */
    setMessage("New favorite list created");
    setShowForm(!showForm);
    return "New favorite list created";
  }

  return (
    <div className="container">
      <FavoriteLists
        useOnOff={false}
        deleteOnOff={true}
        userInfo={userInfo}
        functionSetUserInfo={functionSetUserInfo}
      />
      <div className="container-new-fav-list">
        <h3>
          New favorite list <OpenIcon show={showForm} setShow={setShowForm} />
        </h3>
        <div
          className={
            showForm ? "container-form active" : "container-form hidden"
          }
        >
          <div className="new-fav-list">
            <ul>
              {newFav ? (
                Object.values(newFav).map((ele: any, index: number) => {
                  return (
                    <li key={index}>
                      <img
                        className="minus-button"
                        src="./minus-big.png"
                        alt="remove"
                        onClick={() => {
                          setNewFav((prevState) => {
                            const newState = { ...prevState };
                            delete newState[ele.id];
                            return newState;
                          });
                        }}
                      />
                      {ele.name}{" "}
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
                <TemporaryMessage
                  message={message}
                  type="message-small"
                  timeInMS={3000}
                />

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
                        <img
                          src="./add.png"
                          className="add-button"
                          onClick={() => {
                            setNewFav((prevState) => ({
                              ...prevState,
                              [ele.id]: ele,
                            }));
                          }}
                          alt="add"
                        ></img>
                        {ele.name}
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
                        <img
                          src="./add.png"
                          className="add-button"
                          onClick={() => {
                            setNewFav((prevState) => ({
                              ...prevState,
                              [ele.id]: ele,
                            }));
                          }}
                          alt="add"
                        ></img>
                        {ele.name}
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
