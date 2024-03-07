import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import TemporaryMessage from "@/app/utils/message";
import { useAuthContext } from "@/context/AuthContext";
import { sendToUsers } from "@/firebase/db/users";
import React, { useEffect, useState } from "react";

interface Props {
  deleteOnOff: boolean;
  useOnOff: boolean;
  setTodayList?: (data: any) => void | boolean;
  userInfo: any;
  functionSetUserInfo?: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}
interface UserInfo {
  nickname: string;
  lists: { [key: string]: object };
  todayList: { [key: string]: object };
}

const FavoriteLists: React.FC<Props> = ({
  useOnOff,
  deleteOnOff,
  setTodayList,
  userInfo,
  functionSetUserInfo,
}) => {
  /*   const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null); */
  const { user }: any = useAuthContext();
  const [showFav, setShowFav] = useState(false);
  const [messageDelete, setMessageDelete] = useState("");

  function useThisList(listname: string) {
    // fonction drilled depuis homepage
    if (setTodayList && userInfo) {
      setTodayList(userInfo.lists[listname]);
    }
    // set le localstorage todayList

    // set le localstorage users=>todayList ?
  }
  async function removeList(listname: string) {
    // pour remove list de DB et local
    console.log(listname);
    /*     console.log("userInfo : ", userInfo); */
    if (!userInfo || !functionSetUserInfo) {
      return;
    }
    const newlist: { [listName: string]: any } = { ...userInfo.lists };
    delete newlist[listname];

    const updatedUserInfo = {
      ...userInfo,
      lists: {
        ...userInfo.lists,
      },
    };
    delete updatedUserInfo.lists[listname];
    console.log("user info data apres modif : ", updatedUserInfo);
    // to db :
    let dataSent = await sendToUsers(updatedUserInfo, user.uid);
    if (!dataSent) {
      setMessageDelete("fail to delete");
      return "fail to delete";
    }
    // if db ok, setlocal et set userInfoData
    setMessageDelete(`${listname} has been deleted`);
    localStorage.setItem("users", JSON.stringify(updatedUserInfo));
    functionSetUserInfo(updatedUserInfo);
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
            {userInfo &&
              Object.keys(userInfo.lists).map(
                (listName: string, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <li>
                        {listName}
                        {useOnOff ? (
                          <button
                            className="add"
                            onClick={() => {
                              useThisList(listName);
                              /*              listDetail(listName); */
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
          {setTodayList ? (
            <button
              className="add"
              onClick={() => {
                location.reload();
              }}
            >
              use the previous list
            </button>
          ) : (
            ""
          )}
          <TemporaryMessage message={messageDelete} />
        </div>
      </div>
    </>
  );
};

export default FavoriteLists;
