"use client";
import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import { useAuthContext } from "@/context/AuthContext";
import { sendToHistoric, updateHistoric } from "@/firebase/db/historic";
import Link from "next/link";
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
  [activityId: string]: Task | string;
}

const Page = () => {
  const date = window.location.pathname.split("/")[2]; // On obtient la date dans le format YYYY-MM-DD
  const { user } = useAuthContext() as { user: UserData };
  const [historic, setHistoric] = useState<{
    [date: string]: HistoricData;
  } | null>(null);

  useEffect(() => {
    console.log("Date extraite des paramètres d'URL :", date);
    const data = getItemFromLocalStorage("historic");
    setHistoric(data);
  }, [date]);

  const [dayData, setDayData] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const { name, value } = e.target;
    setDayData((prevData) => ({
      ...prevData,
      [`${itemId}_${name}`]: value,
    }));
  };

  const handleSave = (itemId: string) => {
    if (!historic) {
      return;
    }
    const inputElement = document.getElementById(
      `${itemId}_count`
    ) as HTMLInputElement;
    const countValue = inputElement.value;
    const updatedHistoric = {
      ...historic,
      [date]: {
        ...historic[date],
        [itemId]: {
          ...historic[date][itemId],
          count: countValue || "0",
        },
      },
    };
    console.log("updated historic  :", updatedHistoric);

    return;
    setHistoric(updatedHistoric);
  };
  // Retour et send to db
  function backAndSendToDB() {
    return;
    updateHistoric(historic, user.uid);
    localStorage.setItem("historic", JSON.stringify(historic));
  }
  return (
    <div>
      <h2>Date : {date}</h2>
      {historic &&
        Object.values(historic[date]).map((e: Task | string, index) => {
          if (typeof e === "string") {
            return null;
          }
          return (
            <div className="task" key={index}>
              {e.name} :{" "}
              {typeof e.unit === "boolean" ? (
                <>
                  <input
                    type="hidden"
                    name={`${e.id}_unit`}
                    value={e.unit ? "true" : "false"}
                  />{" "}
                  <div
                    onClick={() => {
                      const updatedHistoric = { ...historic };
                      updatedHistoric[date][e.id].unit = !e.unit;
                      setHistoric(updatedHistoric);
                    }}
                  >
                    {e.unit ? "done" : "not done"}
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    name={`${e.id}_count`}
                    id={`${e.id}_count`}
                    defaultValue={dayData[`${e.id}_count`] || ""}
                    placeholder={e.count.toString()}
                    onChange={(e) =>
                      handleInputChange(e, e.target.id.split("_")[0])
                    }
                  />
                  {e.unit}{" "}
                  <button
                    onClick={() => {
                      handleSave(e.id);
                    }}
                  >
                    save
                  </button>
                </>
              )}
            </div>
          );
        })}
      <Link href="/historic" onClick={backAndSendToDB}>
        back and save
      </Link>
    </div>
  );
};

export default Page;
