"use client";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import BarChart from "./components/BarChart";

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

const Page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [dataHistoric, setDataHistoric] = useState<HistoricData | null>(null);
  ChartJS.register(ArcElement, Tooltip, Legend);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { snapShot } = await checkDB("historic", user.uid);
        if (!snapShot.exists()) return;
        const historicData: HistoricData = snapShot.data();
        setDataHistoric(historicData);
        localStorage.setItem("historic", JSON.stringify(historicData));
      } catch (error) {
        console.error("Error fetching historic data:", error);
      }
    };

    const inLocalStorage = localStorage.getItem("historic");
    if (inLocalStorage) {
      const localData: HistoricData = JSON.parse(inLocalStorage);
      setDataHistoric(localData);
    } else {
      fetchData();
    }
  }, [user.uid]);

  const sortedHistoricDays = dataHistoric
    ? Object.entries(dataHistoric)
        .filter(([_, historicDay]) => historicDay.date)
        .map(([date, historicDay]) => ({ date, historicDay }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(({ historicDay }) => historicDay)
    : [];

  return (
    <>
      <main>
        <BarChart data={sortedHistoricDays} task="squat" />
        <BarChart data={sortedHistoricDays} task="marcher" />
      </main>
      {/*       <Footer /> */}
    </>
  );
};

export default Page;
