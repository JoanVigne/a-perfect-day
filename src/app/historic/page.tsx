"use client";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import BarChart from "./components/BarChart";
import Footer from "@/components/Footer";
import { getItemFromLocalStorage } from "../utils/localstorage";

interface UserData {
  email: string;
  uid: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  unit: string | boolean;
  count: string | number;
}

interface HistoricData {
  [shortDate: string]: {
    date: string;
    [activityId: string]: Task | any;
  };
}
interface UserInfo {
  nickname: string;
  lists: { [key: string]: object };
  todayList: { [key: string]: object };
}

const Page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [dataHistoric, setDataHistoric] = useState<HistoricData | null>(null);
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetchData();
    const userInfoLocal = getItemFromLocalStorage("users");
    setUserInfo(userInfoLocal);
  }, [user.uid]);

  async function fetchData() {
    try {
      const { snapShot } = await checkDB("historic", user.uid);
      if (!snapShot.exists()) return;
      const historicData: HistoricData = snapShot.data();
      setDataHistoric(historicData);
      localStorage.setItem("historic", JSON.stringify(historicData));
    } catch (error) {
      console.error("Error fetching historic data:", error);
    }
  }

  const sortedHistoricDays = dataHistoric
    ? Object.entries(dataHistoric)
        .filter(([_, historicDay]) => historicDay.date)
        .map(([date, historicDay]) => ({ date, historicDay }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(({ historicDay }) => historicDay)
    : [];

  // Fonction pour compter les occurrences des tâches
  function countTasks(data: HistoricData) {
    const taskCounts: { [key: string]: number } = {};
    for (const date in data) {
      const day = data[date];
      for (const taskId in day) {
        const task = day[taskId];
        if (task.name && task.name !== "date") {
          // Vérifier que c'est une tâche valide
          if (!taskCounts[task.name]) {
            taskCounts[task.name] = 0;
          }
          taskCounts[task.name]++;
        }
      }
    }
    return taskCounts;
  }

  // Compter les occurrences des tâches
  const taskCounts = countTasks(dataHistoric as HistoricData);

  // Trier les tâches par nombre d'occurrences
  const sortedTasks = Object.keys(taskCounts).sort(
    (a, b) => taskCounts[b] - taskCounts[a]
  );

  // Récupérer uniquement les trois premières tâches
  const topThreeTasks = sortedTasks.slice(0, 3);

  return (
    <>
      <main>
        {topThreeTasks.map((task) => (
          <BarChart key={task} data={sortedHistoricDays} task={task} />
        ))}
      </main>
      {userInfo && <Footer userInfo={userInfo} />}
    </>
  );
};

export default Page;
