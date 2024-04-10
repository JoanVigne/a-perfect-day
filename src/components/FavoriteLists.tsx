import { getItemFromLocalStorage } from "@/utils/localstorage";

import { useAuthContext } from "@/context/AuthContext";
import { sendToUsers } from "@/firebase/db/users";
import React, { useEffect, useState } from "react";
import TemporaryMessage from "./TemporaryMessage";
import IconOpen from "./IconOpen";
import Icon from "./Icon";

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
          <IconOpen show={showFav} setShow={setShowFav} />
          Favorite lists
        </h3>
        <div className={`excisting-favorites ${showFav ? "active" : "hidden"}`}>
          <ul>
            {setTodayList ? (
              <li>
                <button
                  className="cancel"
                  onClick={() => {
                    location.reload();
                  }}
                >
                  Back to previous list
                </button>
              </li>
            ) : (
              ""
            )}
            {userInfo &&
              Object.keys(userInfo.lists).map(
                (listName: string, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <li>
                        {useOnOff ? (
                          <button
                            className="save"
                            onClick={() => {
                              useThisList(listName);
                            }}
                          >
                            {listName}
                          </button>
                        ) : (
                          ""
                        )}

                        {deleteOnOff ? (
                          <Icon
                            nameImg="delete"
                            onClick={() => {
                              removeList(listName);
                            }}
                          />
                        ) : (
                          /*  <img
                            src="./delet.png"
                            alt="remove"
                            className="remove"
                            onClick={() => {
                              removeList(listName);
                            }}
                          /> */
                          ""
                        )}
                      </li>
                    </React.Fragment>
                  );
                }
              )}
          </ul>

          <TemporaryMessage
            message={messageDelete}
            type="message-error"
            timeInMS={3000}
          />
        </div>
      </div>
    </>
  );
};

export default FavoriteLists;
