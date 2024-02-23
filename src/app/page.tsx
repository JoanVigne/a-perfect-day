"use client";

import Today from "@/components/Today";
import "./pageHome.css";
import CommonTasks from "@/components/CommonTasks";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/config";
import Footer from "@/components/Footer";
import { doc } from "firebase/firestore";
import { sendToHistoric } from "@/firebase/db/db";

interface UserData {
  email: string;
  uid: string;
}
interface UserInfo {
  nickname: string;
}
export default function Home() {
  const { user } = useAuthContext() as { user: UserData };

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (user == null || user.uid == null || user.uid == undefined) {
      return;
    }
    const fetchData = async () => {
      try {
        const fetching = await fetchOnlyThisIdToLocalStorage("users", user.uid);
        setUserInfo(fetching[0]);
      } catch (error) {
        console.error("Error fetching common tasks:", error);
      }
    };

    fetchData();
  }, [user]);

  const [todayList, setTodayList] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const localStorageTodayList = localStorage.getItem("todayList");
    const todayDate = new Date().toISOString();

    if (localStorageTodayList === null) {
      // il n'y a rien dans le localStorage, donc créer un nouveau ?
      const newList = {
        date: todayDate,
      };
      localStorage.setItem("todayList", JSON.stringify(newList));
      setTodayList(newList);
    }
    // SI IL Y A DANS LOCAL STORAGE
    if (localStorageTodayList !== null) {
      let parsed = JSON.parse(localStorageTodayList);
      if (!parsed.date) {
        // si il n'y a pas la date
        const withDate = { ...parsed, date: todayDate };
        setTodayList(withDate);
        localStorage.setItem("todayList", JSON.stringify(withDate));
        return;
      }
      const compareDateDay = parsed.date.slice(0, 10);
      const newDate = todayDate.slice(0, 10);
      if (compareDateDay !== newDate) {
        // si pas la date du jour
        sendToHistoric(parsed, user.uid);
        const withDate = { ...parsed, date: todayDate };
        setTodayList(withDate);
        localStorage.setItem("todayList", JSON.stringify(withDate));
      }
      if (compareDateDay === newDate) {
        console.log("C'est le même jour donc ne rien faire");
        setTodayList(parsed);
      }
    }
  }, []);

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
      console.log("Task with the same name or ID already exists in the list.");
      return;
    }
    const updatedList = { ...todayList };
    updatedList[task.id] = task;
    setTodayList(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
  };
  const handleRemoveTaskFromTodayList = (itemId: string) => {
    const updatedList = { ...todayList };
    delete updatedList[itemId];
    setTodayList(updatedList);
    localStorage.setItem("todayList", JSON.stringify(updatedList));
  };
  return (
    <>
      <main>
        <h1>
          Welcome <br></br> {userInfo && userInfo.nickname}
        </h1>
        <button
          onClick={() => {
            const localStorageTodayList = localStorage.getItem("todayList");
            if (localStorageTodayList !== null) {
              const parsed = JSON.parse(localStorageTodayList);
              sendToHistoric(parsed, user.uid);
            }
          }}
        >
          SEND TO HISTORIC
        </button>
        <p></p>
        <Today
          list={todayList}
          handleRemoveTaskFromTodayList={handleRemoveTaskFromTodayList}
        />
        <h2>Common tasks</h2>
        <CommonTasks handleAddTaskToTodayList={handleAddTaskToTodayList} />
        <h2>CuSTOM tasks</h2>
        <p>ici la liste des tasks que l'utilisateur a créé</p>
        <h2>Listes favorites</h2>
        <h3>titre : semaine</h3>
        <h3>titre : weekend</h3>
        <h3>titre: vacances</h3>
      </main>
      <Footer />
    </>
  );
}
