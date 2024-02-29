"use client";

import Today from "@/components/Today";
import "./pageHome.css";
import CommonTasks from "@/components/CommonTasks";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import Footer from "@/components/Footer";
import { checkDB } from "@/firebase/db/db";
import { sendToHistoric } from "@/firebase/db/historic";
import CustomTasks from "@/components/CustomTasks";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { firebaseApp } from "@/firebase/config";
import Lists from "@/components/Lists";

interface UserData {
  email: string;
  uid: string;
}
interface UserInfo {
  nickname: string;
  lists: Array<string>;
}
export default function Home() {
  const { user } = useAuthContext() as { user: UserData };
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  useEffect(() => {
    async function checkFBInit() {
      try {
        await firebaseApp;
        setFirebaseInitialized(true);
      } catch (error) {
        console.error("Error fetching common tasks:", error);
      }
    }
    if (user == null || user?.uid == null || user?.uid == undefined) {
      return router.push("/connect");
    } else {
      const fetchData = async () => {
        try {
          const fetching = await fetchOnlyThisIdToLocalStorage(
            "users",
            user.uid
          );
          setUserInfo(fetching);
        } catch (error) {
          console.error("Error fetching common tasks:", error);
        }
      };
      checkFBInit();
      fetchData();
      whichList();
    }
  }, [user]);

  const [todayList, setTodayList] = useState<{ [key: string]: any }>({});
  const [messagelist, setMessagelist] = useState<string | null>(null);
  async function checkDBForTodayList() {
    console.log("checkDbForTodayList");
    const { snapShot } = await checkDB("users", user.uid);
    const todayListFromDB = snapShot.exists()
      ? snapShot.data().todayList
      : null;
    console.log("todayList :", todayListFromDB);
    return todayListFromDB;
  }
  function updateStorageAndTodayList(data: any) {
    localStorage.setItem("todayList", JSON.stringify(data));
    setTodayList(data);
    return data;
  }
  async function whichList() {
    const localStorageTodayList = localStorage.getItem("todayList");
    const todayDate = new Date().toISOString();
    if (localStorageTodayList === null) {
      const userLocal: string | null = localStorage.getItem("users");
      if (userLocal !== null) {
        const user = JSON.parse(userLocal);
        if (user.todayList) {
          console.log("user.todayList", user.todayList);
          return user.todayList;
        }
      }
      const todayListFromDb = await checkDBForTodayList();
      if (todayListFromDb) {
        updateStorageAndTodayList(todayListFromDb);
        return todayListFromDb;
      } else {
        const newList = { date: todayDate };
        localStorage.setItem("todayList", JSON.stringify(newList));
        return newList;
      }
    }
    if (localStorageTodayList !== null) {
      const parsedTodayList = JSON.parse(localStorageTodayList);
      if (parsedTodayList.date === undefined) {
        const withDate = { ...parsedTodayList, date: todayDate };
        setTodayList(withDate);
        return withDate;
      }
      if (parsedTodayList.date !== undefined) {
        const compareDateDay = parsedTodayList.date.slice(0, 10);
        const newDate = todayDate.slice(0, 10);
        if (compareDateDay !== newDate) {
          sendToHistoric(parsedTodayList, user.uid);
          const resetedData = resetListToFalseAndZero(parsedTodayList);
          updateStorageAndTodayList(resetedData);
          return resetedData;
        }
        if (compareDateDay === newDate) {
          setTodayList(parsedTodayList);
          return parsedTodayList;
        }
      } else {
        console.log("aucune condition dans whichList");
        setTodayList(parsedTodayList);
        return parsedTodayList;
      }
    }
  }

  interface Task {
    id: string;
    name: string;
    description: string;
    details: string;
    count: any;
    unit: any;
  }
  const handleAddTaskToTodayList = (task: Task) => {
    if (typeof todayList !== "object" || Array.isArray(todayList)) {
      console.error("todayList is not an object.");
      return;
    }
    const isTaskAlreadyExists = Object.values(todayList).some(
      (existingTask: Task) =>
        existingTask.name === task.name || existingTask.id === task.id
    );

    if (isTaskAlreadyExists) {
      setMessagelist("Task with already exists in the list.");
      return;
    }
    const updatedList = { ...todayList };
    updatedList[task.id] = task;
    setTodayList(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
    setMessagelist(null);
  };
  const handleRemoveTaskFromTodayList = (itemId: string) => {
    const updatedList = { ...todayList };
    delete updatedList[itemId];
    setTodayList(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
  };
  function resetListToFalseAndZero(data: any) {
    console.log("today list reseted");
    const todayDate = new Date().toISOString();
    let copyData = JSON.parse(JSON.stringify(data));
    if (!copyData) {
      console.log("nothing in local storage");
      copyData = { date: todayDate };
      console.log("nothing in local storage, copyData : ", copyData);
      return copyData;
    }
    Object.keys(copyData).forEach((key) => {
      const ele = copyData[key];
      if (typeof ele.unit === "boolean") {
        copyData[key].unit = false;
      }
      if (typeof ele.unit === "string" || typeof ele.unit === "number") {
        copyData[key].count = "0";
      }
    });
    copyData.date = todayDate;
    return copyData;
  }

  if (!user || !firebaseInitialized) {
    return <Loading />;
  }
  return (
    <>
      <main>
        <h1>
          Welcome <br></br> {userInfo?.nickname}
        </h1>

        <button
          onClick={async () => {
            const tsx = whichList();
            console.log("TEST : ", tsx);
          }}
        >
          test
        </button>
        <div className="container">
          <Today
            list={todayList}
            handleRemoveTaskFromTodayList={handleRemoveTaskFromTodayList}
            userid={user?.uid}
          />
          <p className="message-error">{messagelist}</p>
        </div>
        <div className="container">
          <h2>Custom tasks</h2>
          <CustomTasks
            handleAddTaskToTodayList={handleAddTaskToTodayList}
            userId={user?.uid}
          />
        </div>
        <div className="container">
          <h2>Common tasks</h2>
          <CommonTasks handleAddTaskToTodayList={handleAddTaskToTodayList} />
        </div>
        <h2>Comming soon :</h2>
        <h3>historic and statistic</h3>
        <h3>favorite list ( week days, weekend, hollidays... )</h3>
        <Lists user={userInfo ? userInfo : null} />
      </main>
      <Footer />
    </>
  );
}
