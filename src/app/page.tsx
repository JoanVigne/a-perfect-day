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

  const [todayList, setTodayList] = useState({});
  /* 
  useEffect(() => {
    const localStorageTodayList = localStorage.getItem("todayList");
    if (localStorageTodayList !== null) {
      const parsed = JSON.parse(localStorageTodayList);
      if (parsed.date === undefined) {
        const todayDate = new Date().toISOString();
        const updatedList = { ...parsed };
        updatedList.date = todayDate;
        setTodayList(updatedList);
        console.log("Updated list:", updatedList);
        localStorage.setItem("todayList", JSON.stringify(updatedList));
      }

      const newDate = new Date().toISOString();
      const compareDateDay = parsed.date.slice(0, 10);
      const newDateDay = newDate.slice(0, 10);

      if (compareDateDay !== newDateDay) {
        console.log("Les jours sont différents :");
        console.log("parsed.date (jour)", compareDateDay);
        console.log("new Date().toISOString() (jour)", newDateDay);
        sendToHistoric(parsed, user.uid);
      } else {
        console.log("C'est le même jour");
      }
    }
  }, []); */

  // if todayList empty => if localstorage empty => fetch
  /*   useEffect(() => {
    const dataLocalStorage = localStorage.getItem("todayList");
    setTodayList(JSON.parse(dataLocalStorage));
  }, []); */

  const handleAddTaskToTodayList = (task: object) => {
    if (typeof todayList !== "object" || Array.isArray(todayList)) {
      console.error("todayList is not an object.");
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
              sendToHistoric(parsed, user.uid, parsed.date);
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
