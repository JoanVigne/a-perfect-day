"use client";

import Today from "@/components/Today";
import "./pageHome.css";
import CommonTasks from "@/components/CommonTasks";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/config";
import Footer from "@/components/Footer";

interface UserData {
  email: string;
  uid: string;
}

export default function Home() {
  const { user } = useAuthContext() as { user: UserData };

  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (user == null || user.uid == null || user.uid == undefined) {
      return;
    }
    const fetchData = async () => {
      try {
        const fetching = await fetchOnlyThisIdToLocalStorage("users", user.uid);
        setUserInfo(fetching);
      } catch (error) {
        console.error("Error fetching common tasks:", error);
      }
    };

    fetchData();
  }, [user]);

  const [todayList, setTodayList] = useState({});

  // if todayList empty => if localstorage empty => fetch
  /*   useEffect(() => {
    const dataLocalStorage = localStorage.getItem("todayList");
    setTodayList(JSON.parse(dataLocalStorage));
  }, []); */

  const handleCommonTaskClick = (commonTask: object) => {
    if (typeof todayList !== "object" || Array.isArray(todayList)) {
      console.error("todayList is not an object.");
      return;
    }

    // Copiez l'objet existant
    const updatedList = { ...todayList };

    // Ajoutez ou mettez à jour la tâche commune
    updatedList[commonTask.id] = commonTask;

    setTodayList(updatedList);
    console.log("Updated list:", updatedList);

    localStorage.setItem("todayList", JSON.stringify(updatedList));
  };
  return (
    <>
      <main>
        <h1>Welcome {user && user.email} </h1>
        <h2>My list</h2>
        <p>ici la liste des tasks du jour ! </p>
        <Today list={todayList} />
        <h2>Common tasks</h2>
        <CommonTasks addCommonTask={handleCommonTaskClick} />
        <h2>CuSTOM tasks</h2>
        <p>ici la liste des tasks que l'utilisateur a créé</p>
      </main>
      <Footer />
    </>
  );
}
