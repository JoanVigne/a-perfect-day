"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import { checkDB, db } from "@/firebase/db/db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

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
  {
    users && console.log("users", users);
  }
  function checkThisUser(id: string) {
    console.log("user id", id);
  }
  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <div className="container">
        <div className="smaller-container">
          <h2>list of all the users :</h2>
          <ul>
            {users.map((user: any, index: number) => (
              <li
                key={index}
                onClick={() => {
                  checkThisUser(user.id);
                }}
              >
                <h3>{user.nickname}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h1>Access denied. You are not an admin.</h1>
    </div>
  );
};

export default Page;
