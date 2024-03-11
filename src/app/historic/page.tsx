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

  // trier les non-booleens
  function filterBooleanTasks(tasks: string[], data: HistoricData): string[] {
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
    // Retirer les doublons et les tâches booléennes de la liste
    console.log(tasks.filter((task) => !booleanTasks.includes(task)));
    return tasks.filter((task) => !booleanTasks.includes(task));
  }
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
  // trier les booleens
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
  function findLastTimePerformed(taskName: string) {
    let lastTimePerformed: string | null = null;

    // Parcourir les jours historiques, en partant du plus récent
    for (let i = sortedHistoricDays.length - 1; i >= 0; i--) {
      const historicDay = sortedHistoricDays[i];
      // Vérifier si la tâche est présente dans ce jour historique
      if (historicDay.hasOwnProperty(taskName)) {
        lastTimePerformed = historicDay.date;
        break; // Sortir de la boucle une fois que la dernière date est trouvée
      }
    }

    return lastTimePerformed;
  }

  // Utiliser la fonction pour chaque tâche booléenne
  /*   booleanTasks.forEach((task) => {
    const lastTime = findLastTimePerformed(task);
    console.log(`La dernière fois que "${task}" a été effectuée : ${lastTime}`);
  }); */
  return (
    <>
      <main>
        <div className="container">
          <div className="task-stat-container">
            {nonBooleanTasks &&
              nonBooleanTasks.map((task) => {
                /*     if (!task) {
                return;
              }
 */
                return (
                  <span key={task} className="task-stat-card">
                    <h3>{task}</h3>
                    <h4>
                      How many times:{" "}
                      <Count data={sortedHistoricDays} taskName={task} />
                    </h4>
                    <h4>last time: </h4>
                    <h4>
                      Highest streak:{" "}
                      <Streak data={sortedHistoricDays} taskName={task} />
                    </h4>
                  </span>
                );
              })}
          </div>
        </div>
        <div className="container">
          <h2>The task done or not :</h2>
          {booleanTasks &&
            booleanTasks.map((task) => {
              return (
                <span key={task} className="task-stat-card">
                  <h3>{task}</h3>
                  <h4>
                    How many times :{" "}
                    <Count data={sortedHistoricDays} taskName={task} />{" "}
                  </h4>
                  <h4>last time :</h4>
                  <h4>
                    Streak: <Streak data={sortedHistoricDays} taskName={task} />{" "}
                  </h4>
                </span>
              );
            })}
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
