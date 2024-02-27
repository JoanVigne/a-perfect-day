"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import { checkDB } from "@/firebase/db/db";

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
    [activityId: string]: Task | string;
  };
}

const Page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [dataHistoric, setDataHistoric] = useState<HistoricData | null>(null);

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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options = { month: "long" as const, day: "2-digit" as const };
    return date.toLocaleDateString("fr-FR", options); // Vous pouvez ajuster le local selon vos besoins
  }

  return (
    <>
      <main>
        {sortedHistoricDays.map((day, index) => (
          <div key={`historic-${index}`}>
            <p>Date: {formatDate(day.date)}</p>
            <p></p>
            {Object.entries(day)
              .filter(([key]) => key !== "date")
              .map(([activityId, activity]) => (
                <div key={activityId}>
                  <h3>{(activity as Task).name}</h3>
                  {/*   <p>{(activity as Task).details}</p> */}
                  <p>
                    {(activity as Task).count} {(activity as Task).unit}
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
