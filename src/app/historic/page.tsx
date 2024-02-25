"use client";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";
import React, { useEffect, useState } from "react";

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
  [date: string]: {
    [activityId: string]: Task;
  };
}

const Page = () => {
  const { user } = useAuthContext() as { user: UserData };

  const [dataHistoric, setDataHistoric] = useState<HistoricData | null>(null);

  useEffect(() => {
    const inLocalStorage = localStorage.getItem("historic");
    if (inLocalStorage) {
      const localData: HistoricData = JSON.parse(inLocalStorage);
      const dates = Object.keys(localData).map((key) => key.slice(0, 10));
      const today = new Date().toISOString().slice(0, 10);
      const isTodayInHistoric = dates.includes(today);
      if (isTodayInHistoric) {
        console.log("historic dans local déjà à jour !");
        setDataHistoric(localData);
        return;
      }
      console.log("historic local pas à jour :");
      fetchHistoric();
    } else {
      console.log("pas dans local ");
      fetchHistoric();
    }
  }, []);

  async function fetchHistoric() {
    const { ref, snapShot } = await checkDB("historic", user.uid);
    if (!snapShot.exists()) {
      console.log("id utilisateur introuvable dans collection historic");
      return;
    }
    const historicData: HistoricData = snapShot.data();
    console.log(historicData);
    setDataHistoric(historicData);
    localStorage.setItem("historic", JSON.stringify(historicData));
  }

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
        <h1>Historique</h1>
        {dataHistoric &&
          sortedHistoricDays.map((historicDay, index) => (
            <div key={`historic-${index}`}>
              <h2>Day: {index}</h2>
              <h3>date: {/* {console.log(historicDay.date)} probleme TS */}</h3>
              {Object.values(historicDay).map((activity: Task) => (
                <div key={activity.id}>
                  <h3>{activity.name}</h3>
                  <p>
                    {typeof activity.unit === "string" ? (
                      <>
                        {activity.count} {activity.unit}
                      </>
                    ) : (
                      "done !"
                    )}
                  </p>
                </div>
              ))}
            </div>
          ))}
      </main>
      <Footer />
    </>
  );
};

export default Page;
