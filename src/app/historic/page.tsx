"use client";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import BarChart from "./components/BarChart";
import Footer from "@/components/Footer";
import { getItemFromLocalStorage } from "../../utils/localstorage";
import LineChart from "./components/LineChart";

import Streak from "./components/Streak";
import Count from "./components/Count";
import LastTime from "./components/LastTime";
import HighestScore from "./components/HighestScore";
import Header from "@/components/Header";
import { findTasksByType } from "./utils/utils";
import PreviousDay from "./components/PreviousDay";
import { useRouter } from "next/navigation";

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
      if (user == null || user?.uid == null || user?.uid == undefined) {
        router.push("/connect");
      } else {
        fetchData();
      }
      const userInfoLocal = getItemFromLocalStorage("users");
      setUserInfo(userInfoLocal);
      const data = getItemFromLocalStorage("historic");
      setDataHistoric(data);
    },
    [
      /* user */
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
  const sortedByDate = getSortedHistoricDays(dataHistoric);
  /*   const sortedByHowOften = sortByHowOften(dataHistoric);
  // Récupérer uniquement les trois premières tâches DE TOUT L'HISTORIC
  const topThreeTasks = sortedByHowOften.slice(0, 3); */
  //
  const nonBooleanTasks = findTasksByType(
    dataHistoric as HistoricData,
    "nonBoolean"
  );
  const sortedNonBooleanTasks = sortByHowOften(
    nonBooleanTasks,
    dataHistoric as HistoricData
  );

  const booleanTasks = findTasksByType(dataHistoric as HistoricData, "boolean");
  const sortedBooleanTasks = sortByHowOften(
    booleanTasks,
    dataHistoric as HistoricData
  );
  // top 3 :
  function getTopThreeTasks(tasks: string[]): string[] {
    return tasks.slice(0, 3);
  }
  const topThreeNonBooleanTasks = getTopThreeTasks(sortedNonBooleanTasks);
  const topThreeBooleanTasks = getTopThreeTasks(sortedBooleanTasks);

  function getRemainingNonBooleanTasks(
    nonBooleanTasks: string[],
    topThreeTasks: string[]
  ): string[] {
    const remainingNonBooleanTasks: string[] = [];
    for (const task of nonBooleanTasks) {
      if (!topThreeTasks.includes(task)) {
        remainingNonBooleanTasks.push(task);
      }
    }
    return remainingNonBooleanTasks;
  }

  const remainingNonBooleanTasks = getRemainingNonBooleanTasks(
    nonBooleanTasks,
    topThreeNonBooleanTasks
  );

  const [showAllNonBoolean, setShowAllNB] = useState(false);
  return (
    <>
      <Header />
      <main>
        <h1>Historic</h1>
        <div className="container">
          <h2>Countable</h2>
          <div className="task-stat-container">
            {topThreeNonBooleanTasks &&
              topThreeNonBooleanTasks.map((task) => {
                return (
                  <span key={task} className="task-stat-card">
                    <h3>{task}</h3>

                    <Count data={sortedByDate} taskName={task} />

                    <Streak data={sortedByDate} taskName={task} />

                    <LastTime data={sortedByDate} taskName={task} />

                    <HighestScore data={sortedByDate} taskName={task} />
                  </span>
                );
              })}
          </div>
          {/*           <button onClick={() => setShowAllNB(!showAllNonBoolean)}>
            {showAllNonBoolean ? "v" : "^"}
            
          </button> */}
          <h3>
            <img
              onClick={() => setShowAllNB(!showAllNonBoolean)}
              className={showAllNonBoolean ? "icon" : "icon rotate"}
              src="./icon/arrow-down.png"
              alt="show"
            />
          </h3>
          <div className="task-stat-container">
            {showAllNonBoolean &&
              remainingNonBooleanTasks.map((task) => {
                return (
                  <span key={task} className="task-stat-card">
                    <h3>{task}</h3>

                    <Count data={sortedByDate} taskName={task} />

                    <Streak data={sortedByDate} taskName={task} />

                    <LastTime data={sortedByDate} taskName={task} />

                    <HighestScore data={sortedByDate} taskName={task} />
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
                    <Count data={sortedByDate} taskName={task} />
                    <Streak data={sortedByDate} taskName={task} />
                    <LastTime data={sortedByDate} taskName={task} />
                  </span>
                );
              })}
          </div>
        </div>

        {/*  <h2>TEST</h2>
        {topThreeTasks.map((task) => (
          <LineChart key={task} data={sortedByDate} task={task} />
        ))}

        <h2>Your 3 most frequent tasks</h2>
        {topThreeTasks.map((task) => (
          <BarChart key={task} data={sortedByDate} task={task} />
        ))} */}
        <div className="container">
          <h2>Change a data in my historic</h2>
          <p>par task ? par date ? </p>
          {dataHistoric && <PreviousDay data={dataHistoric} date="rien" />}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;

function getSortedHistoricDays(dataHistoric: HistoricData | null) {
  if (!dataHistoric) return [];
  return Object.entries(dataHistoric)
    .filter(([_, historicDay]) => historicDay.date)
    .map(([date, historicDay]) => ({ date, historicDay }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(({ historicDay }) => historicDay);
}
function sortByHowOften(tasks: string[], data: HistoricData): string[] {
  const taskCounts: { [key: string]: number } = {};

  // Compter le nombre d'occurrences de chaque tâche
  for (const date in data) {
    const day = data[date];
    for (const taskId in day) {
      const task = day[taskId];
      if (task.name && task.name !== "date" && tasks.includes(task.name)) {
        if (!taskCounts[task.name]) {
          taskCounts[task.name] = 0;
        }
        taskCounts[task.name]++;
      }
    }
  }

  // Trier les tâches par nombre d'occurrences
  return tasks.sort((a, b) => (taskCounts[b] || 0) - (taskCounts[a] || 0));
}
