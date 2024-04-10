"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import { checkDB, db } from "@/firebase/db/db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import "./admin.css";
import Modal from "react-modal";

interface UserData {
  email: string;
  uid: string;
}
const Page: React.FC = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [users, setUsers] = useState<{ id: string }[]>([]);
  const [commonTask, setCommonTask] = useState<any>({});
  const [customTask, setCustomTask] = useState([]);
  const [customChall, setCustomChall] = useState([]);
  const [historic, setHistoric] = useState<any>({});

  async function collectionOfThisUser(thisDB: string, thisUserId: string) {
    const { snapShot } = await checkDB(thisDB, thisUserId);
    if (!snapShot.exists()) return null;
    console.log("snapShot of ", thisDB, snapShot.data());
  }
  async function fetchAllData(thisDB: string) {
    const ref = collection(db, thisDB);
    const snapShot = await getDocs(ref);
    if (snapShot.empty) return [];
    return snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  useEffect(() => {
    console.log("user :", user);

    const fetchData = async () => {
      const commonTaskDB = await fetchAllData("commonTask");

      const customTaskDB = await fetchAllData("customTask");
      const customChallDB = await fetchAllData("customChall");
      const historicDB = await fetchAllData("historic");
      const usersDB = await fetchAllData("users");
      setUsers(usersDB);
    };

    fetchData();
    console.log(" users :", users);
  }, []);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [thisUser, setThisUser] = useState<any>({});
  function checkThisUser(user: any) {
    console.log("user", user);
    setThisUser(user);
    console.log("user id", user.id);
    setSelectedUser(user.id);
  }
  if (user.uid !== "JBoU3yqCAKVI7dsAu109Gz9sEmx2") {
    return <h1>Access denied. You are not an admin.</h1>;
  }

  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <div className="container">
        <div className="smaller-container">
          <h2>All the users :</h2>
          <ul>
            {users.map((user: any, index: number) => (
              <li key={index}>
                <h3>{user.nickname}</h3>
                <button
                  onClick={() => {
                    checkThisUser(user);
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
            {" "}
            <button onClick={() => setSelectedUser(null)}>Close</button>
            {thisUser && (
              <div>
                <h4>Name : {thisUser.nickname}</h4>
                <h4>id : {thisUser.id}</h4>
                {thisUser.todayList && (
                  <>
                    <h3>Today's tasks :</h3>
                    {Object.values(thisUser.todayList).map(
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
                  </>
                )}
                {thisUser.lists && (
                  <div>
                    <h3>Favorites : </h3>
                    <ul>
                      {Object.keys(thisUser.lists).map(
                        (favlist: any, index: number) => (
                          <li key={index}>
                            <h4>{favlist}</h4>
                            <ul>
                              {Object.values(thisUser.lists[favlist]).map(
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
                  </div>
                )}
                <h3>Fetch some data :</h3>

                <button>custom task :</button>
                <button>custom chall :</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Page;
