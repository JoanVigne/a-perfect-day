"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import { checkDB, db } from "@/firebase/db/db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import "./admin.css";
import Modal from "react-modal";
import IconOpen from "@/components/ui/IconOpen";

interface UserData {
  email: string;
  uid: string;
}
const Page: React.FC = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [users, setUsers] = useState<{ id: string }[]>([]);
  const [allCustomTasks, setAllCustomTasks] = useState<any>(null);
  const [allChallenges, setAllChallenges] = useState<any>(null);
  const [allHistoric, setAllHistoric] = useState<any>(null);

  async function fetchAllData(ThisFavDB: string) {
    const ref = collection(db, ThisFavDB);
    const snapShot = await getDocs(ref);
    if (snapShot.empty) return [];
    return snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  useEffect(() => {
    console.log("user :", user);

    console.log(" users :", users);
  }, []);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [ThisFavUser, setThisFavUser] = useState<any>({});
  function checkThisFavUser(user: any) {
    console.log("user", user);
    setThisFavUser(user);
    console.log("user id", user.id);
    setSelectedUser(user.id);
  }

  // show icon open
  const [showThisFav, setShowThisFav] = useState<boolean[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showPerf, setShowPerf] = useState<Record<string, boolean>>({});
  // show THIS data
  const [showingCustomTasks, setshowingCustomTasks] = useState<any>(null);
  const [showingChallenges, setShowingChallenges] = useState<any>(null);
  if (user.uid !== "JBoU3yqCAKVI7dsAu109Gz9sEmx2") {
    return <h1>Access denied. You are not an admin.</h1>;
  }

  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <div className="container">
        <div className="smaller-container">
          <button
            onClick={async () => {
              const usersDB = await fetchAllData("users");
              setUsers(usersDB);
            }}
          >
            Fetch user infos ( id, list of today, favorite lists and nickname)
          </button>

          <h2>All the users :</h2>
          <ul>
            {users.map((user: any, index: number) => (
              <li key={index}>
                <h3>{user.nickname}</h3>
                <button
                  onClick={() => {
                    checkThisFavUser(user);
                  }}
                >
                  about
                </button>
              </li>
            ))}
          </ul>
          <Modal
            isOpen={!!selectedUser}
            onRequestClose={() => setSelectedUser(null)}
            contentLabel="User Details"
            ariaHideApp={false}
          >
            <button onClick={() => setSelectedUser(null)}>Close</button>
            {ThisFavUser && (
              <div>
                <fieldset>
                  <h4>Name : {ThisFavUser.nickname}</h4>
                  <h4>id : {ThisFavUser.id}</h4>
                </fieldset>
                {ThisFavUser.todayList && (
                  <>
                    <fieldset>
                      <h3>What's up today ?</h3>
                      {Object.values(ThisFavUser.todayList).map(
                        (task: any, index: number) => (
                          <div key={index}>
                            {typeof task === "string" ? (
                              `date : ${task}`
                            ) : (
                              <h4>
                                - {task.name} :
                                {typeof task.unit === "boolean" ? (
                                  <>{task.unit ? "done" : "not done"}</>
                                ) : (
                                  <>
                                    {task.count} {task.unit}
                                  </>
                                )}
                              </h4>
                            )}
                          </div>
                        )
                      )}
                    </fieldset>
                  </>
                )}

                {ThisFavUser.lists && (
                  <fieldset>
                    <h3>
                      Favorites :
                      <IconOpen
                        show={showFavorites}
                        setShow={setShowFavorites}
                      />
                    </h3>
                    <ul className={showFavorites ? "active" : "hidden"}>
                      {Object.keys(ThisFavUser.lists).map(
                        (favlist: any, index: number) => (
                          <li key={index}>
                            <h4>{favlist}</h4>
                            <IconOpen
                              show={showThisFav[index] || false}
                              setShow={(value: boolean) => {
                                const newShowThisFav = [...showThisFav];
                                newShowThisFav[index] = value;
                                setShowThisFav(newShowThisFav);
                              }}
                            />
                            <ul
                              className={
                                showThisFav[index] ? "active" : "hidden"
                              }
                            >
                              {Object.values(ThisFavUser.lists[favlist]).map(
                                (task: any, index: number) => (
                                  <li key={index}>
                                    <h5>{task.name}</h5>
                                  </li>
                                )
                              )}
                            </ul>
                          </li>
                        )
                      )}
                    </ul>
                  </fieldset>
                )}
                <fieldset></fieldset>
              </div>
            )}
          </Modal>
        </div>
        <button
          onClick={async () => {
            const data = await fetchAllData("custom");
            setAllCustomTasks(data);
            console.log("data", data);
          }}
        >
          {allCustomTasks ? "custon tasks FETCHED !" : "Fetch Custom tasks"}
        </button>

        <button
          onClick={async () => {
            const data = await fetchAllData("customChall");
            setAllChallenges(data);
            console.log("data", data);
          }}
        >
          {allChallenges ? "challenges FETCHED !" : "Fetch Challenges"}
        </button>
      </div>
      <div className="container">
        {allCustomTasks && (
          <>
            <h2>Custom task</h2>
            <button onClick={() => setshowingCustomTasks(allCustomTasks)}>
              show it
            </button>
          </>
        )}
        {allChallenges && (
          <>
            <h2>Challenges</h2>
            <button onClick={() => setShowingChallenges(allChallenges)}>
              show Challenges
            </button>
          </>
        )}

        {showingCustomTasks &&
          showingCustomTasks.map((data: any, index: number) => (
            <div className="smaller-container" key={index}>
              <h4>User ID: {data.id}</h4>
              {Object.entries(data)
                .filter(([key]) => key !== "id")
                .map(([key, value], i) => (
                  <fieldset key={i}>
                    {typeof value === "object" &&
                      value !== null &&
                      Object.entries(value).map(([key, value], index) => (
                        <div key={index}>
                          <strong>{key}:</strong> {value as ReactNode}
                        </div>
                      ))}
                  </fieldset>
                ))}
            </div>
          ))}
        {showingChallenges &&
          showingChallenges.map((data: any, index: number) => (
            <div className="smaller-container" key={index}>
              <h4>User ID: {data.id}</h4>
              <button
                onClick={() =>
                  setShowPerf((prev) => ({
                    ...prev,
                    [data.id]: !prev[data.id],
                  }))
                }
              >
                {showPerf[data.id]
                  ? "Hide perfs of this user?"
                  : "Show perfs of this user?"}
              </button>

              {Object.entries(data)
                .filter(([key]) => key !== "id")
                .map(([key, value], i) => (
                  <fieldset key={i}>
                    {typeof value === "object" &&
                      value !== null &&
                      Object.entries(value).map(([key, value], index) => (
                        <div
                          key={index}
                          className={
                            key === "perf"
                              ? showPerf[data.id]
                                ? "active"
                                : "hidden"
                              : ""
                          }
                        >
                          <strong>{key}: </strong>
                          {key === "selectedImprovement" &&
                          Array.isArray(value) ? (
                            value.map((item, index) => (
                              <div key={index}>{item}</div>
                            ))
                          ) : key === "perf" &&
                            typeof value === "object" &&
                            value !== null ? (
                            Object.entries(value).map(([key, value], index) => (
                              <div key={index}>
                                <strong>{key}: </strong>
                                {typeof value === "object" && value !== null ? (
                                  Object.entries(value).map(
                                    ([key, value], index) => (
                                      <div key={index}>
                                        <strong>{key}:</strong>{" "}
                                        {value as ReactNode}
                                      </div>
                                    )
                                  )
                                ) : (
                                  <>{value as ReactNode}</>
                                )}
                              </div>
                            ))
                          ) : (
                            <>{value as ReactNode}</>
                          )}
                        </div>
                      ))}
                  </fieldset>
                ))}
            </div>
          ))}
      </div>
      <button
        onClick={async () => {
          const data = await fetchAllData("historic");
          setAllHistoric(data);
        }}
      >
        {allHistoric ? "historic FETCHED !" : "Fetch Historic"}
      </button>
    </div>
  );
};

export default Page;
