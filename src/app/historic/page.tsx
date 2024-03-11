"use client";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import BarChart from "./components/BarChart";
import Footer from "@/components/Footer";
import { getItemFromLocalStorage } from "../utils/localstorage";
import LineChart from "./components/LineChart";
import { useRouter } from "next/navigation";
import Streak from "./components/Streak";
import Count from "./components/Count";
import LastTime from "./components/LastTime";
import HighestScore from "./components/HighestScore";
import Header from "@/components/Header";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(
    () => {
      console.log(" USER : ", user);
      if (user == null || user?.uid == null || user?.uid == undefined) {
        return router.push("/connect");
      } else {
        fetchData();
      }

      const userInfoLocal = getItemFromLocalStorage("users");
      setUserInfo(userInfoLocal);
    },
    [
      /* user.uid */
    ]
  );

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
  // non booleans
  function findNonBooleanTasks(data: HistoricData): string[] {
    const nonBooleanTasks: string[] = [];
    for (const date in data) {
      const day = data[date];
      for (const taskId in day) {
        const task = day[taskId];
        if (typeof task.unit !== "boolean") {
          if (task.name !== undefined && task.name !== null) {
            nonBooleanTasks.push(task.name);
          }
        }
      }
    }
    console.log(
      "Les tâches non booléennes :",
      Array.from(new Set(nonBooleanTasks))
    );
    return Array.from(new Set(nonBooleanTasks));
  }
  const nonBooleanTasks = findNonBooleanTasks(dataHistoric as HistoricData);
  //  booleans
  function findBooleanTasks(data: HistoricData): string[] {
    const booleanTasks: string[] = [];
    for (const date in data) {
      const day = data[date];
      for (const taskId in day) {
        const task = day[taskId];
        if (typeof task.unit === "boolean") {
          booleanTasks.push(task.name);
        }
      }
    }
    console.log("les taches booléennes :", Array.from(new Set(booleanTasks)));
    return Array.from(new Set(booleanTasks));
  }
  const booleanTasks = findBooleanTasks(dataHistoric as HistoricData);

  return (
    <>
      <main>
        <Header nickname={userInfo?.nickname} />
        <div className="container">
          <h2>Countable</h2>
          <div className="task-stat-container">
            {nonBooleanTasks &&
              nonBooleanTasks.map((task) => {
                return (
                  <span key={task} className="task-stat-card">
                    <h3>{task}</h3>

                    <Count data={sortedHistoricDays} taskName={task} />

                    <Streak data={sortedHistoricDays} taskName={task} />

                    <LastTime data={sortedHistoricDays} taskName={task} />

                    <HighestScore data={sortedHistoricDays} taskName={task} />
                  </span>
                );
              })}
          </div>
        </div>
        <div className="container">
          <h2>Not countable:</h2>
          <div className="task-stat-container">
            {booleanTasks &&
              booleanTasks.map((task) => {
                return (
                  <span key={task} className="task-stat-card">
                    <h3>{task}</h3>
                    <Count data={sortedHistoricDays} taskName={task} />
                    <Streak data={sortedHistoricDays} taskName={task} />
                    <LastTime data={sortedHistoricDays} taskName={task} />
                  </span>
                );
              })}
          </div>
        </div>

        <h2>TEST</h2>
        {topThreeTasks.map((task) => (
          <LineChart key={task} data={sortedHistoricDays} task={task} />
        ))}

        <h2>Your 3 most frequent tasks</h2>
        {topThreeTasks.map((task) => (
          <BarChart key={task} data={sortedHistoricDays} task={task} />
        ))}
      </main>
      <Footer />
    </>
  );
};

export default Page;
