import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import TemporaryMessage from "@/app/utils/message";
import { useAuthContext } from "@/context/AuthContext";
import { sendToUsers } from "@/firebase/db/users";
import React, { useEffect, useState } from "react";

interface Props {
  deleteOnOff: boolean;
  useOnOff: boolean;
}
interface UserInfoData {
  nickname: string;
  lists: { [key: string]: object };
}

interface UserData {
  email: string;
  uid: string;
}

const FavoriteLists: React.FC<Props> = ({ useOnOff, deleteOnOff }) => {
  const [userInfoData, setUserInfoData] = useState<UserInfoData | null>(null);
  const { user }: any = useAuthContext();
  const [showFav, setShowFav] = useState(false);
  const [messageDelete, setMessageDelete] = useState("");
  useEffect(() => {
    const data = getItemFromLocalStorage("users");

    setUserInfoData(data);
    console.log("user uid etc ", user);
  }, []);

  function listDetail(name: string) {
    if (userInfoData) {
      console.log("list : ", userInfoData.lists[name]);
      Object.values(userInfoData.lists[name]).forEach((element: any) => {
        console.log("element name: ", element.name);
      });
    }

    // envoyer avec la date du jour !
  }
  async function removeList(listname: string) {
    // pour remove list de DB et local
    console.log(listname);
    /*     console.log("userInfo : ", userInfo); */
    if (!userInfoData) {
      return;
    }
    const newlist: { [listName: string]: any } = { ...userInfoData.lists };
    delete newlist[listname];

    userInfoData.lists = newlist;
    console.log("user info data apres modif : ", userInfoData);
    // to db :
    let dataSent = await sendToUsers(userInfoData, user.uid);
    if (!dataSent) {
      console.log("fail to delete");
      return;
    }
    // if db ok, setlocal et set userInfoData
    setMessageDelete(`${listname} has been deleted`);
    localStorage.setItem("users", JSON.stringify(userInfoData));
    setUserInfoData(userInfoData);
  }

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
        <div className={`excisting-favorites ${showFav ? "active" : "hidden"}`}>
          <ul>
            {userInfoData &&
              Object.keys(userInfoData.lists).map(
                (listName: string, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <li>
                        {listName}
                        {useOnOff ? (
                          <button
                            className="add"
                            onClick={() => {
                              listDetail(listName);
                            }}
                          >
                            Use
                          </button>
                        ) : (
                          ""
                        )}

                        {deleteOnOff ? (
                          <span
                            className="remove"
                            onClick={() => {
                              removeList(listName);
                            }}
                          >
                            <img src="./delet.png" alt="remove" />
                          </span>
                        ) : (
                          ""
                        )}
                      </li>
                    </React.Fragment>
                  );
                }
              )}
          </ul>
          <TemporaryMessage message={messageDelete} />
        </div>
      </div>
    </>
  );
};

export default FavoriteLists;
