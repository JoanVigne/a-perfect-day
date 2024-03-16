"use client";
import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import CommonTasks from "@/components/CommonTasks";
import CustomTasks from "@/components/CustomTasks";
import TemporaryMessage from "@/components/TemporaryMessage";
import { useAuthContext } from "@/context/AuthContext";
import { updateAllHistoric } from "@/firebase/db/historic";
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
  [activityId: string]: Task | any;
}

interface Historic {
  [date: string]: HistoricData;
}

const Page = () => {
  const date = window.location.pathname.split("/")[2]; // On obtient la date dans le format YYYY-MM-DD
  const { user } = useAuthContext() as { user: UserData };
  const [historic, setHistoric] = useState<Historic | null>(null);
  const [messagelist, setMessagelist] = useState<string | null>(null);
  useEffect(() => {
    console.log("Date extraite des paramètres d'URL :", date);
    const data = getItemFromLocalStorage("historic");
    setHistoric(data);
    emptyDay(data, date);
  }, [date]);

  function emptyDay(data: Historic, date: string) {
    console.log("emptyDay ?", data);
    if (data[date]) {
      console.log("ily  a deja !", data[date]);
      return;
    }
    const newDay = {
      date: new Date(date).toISOString(),
    };
    const newHistoric = { ...data };
    newHistoric[date] = newDay;
    setHistoric(newHistoric);
  }

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
    const data = getItemFromLocalStorage("historic");
    setHistoric(data);
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

    setHistoric(updatedHistoric);
  };
  // Retour et send to db
  function backAndSendToDB() {
    if (!historic) {
      return;
    }
    updateAllHistoric(historic, user.uid);
    // localstorage deja updated dans updateAllHistoric
    window.location.href = "/historic";
  }
  function handleAddTask(task: Task) {
    console.log("ajouté dans la liste de ce jour", task);
    if (!historic) {
      return;
    }
    const isTaskAlreadyExists = Object.values(historic[date]).some(
      (existingTask: Task) =>
        existingTask.name === task.name || existingTask.id === task.id
    );
    if (isTaskAlreadyExists) {
      setMessagelist(`"${task.name}" is already in the list`);
      return;
    }
    const newHistoric = { ...historic };
    newHistoric[date][task.id] = task;

    console.log("newHistoric", newHistoric[date]);
    setHistoric(newHistoric);
    setMessagelist(null);
    return newHistoric;
  }
  function handleRemoveTask(task: Task) {
    if (!historic) {
      return;
    }
    const isTaskAlreadyExists = Object.values(historic[date]).some(
      (existingTask: Task) =>
        existingTask.name === task.name || existingTask.id === task.id
    );
    if (!isTaskAlreadyExists) {
      setMessagelist(`"${task.name}" is not in the list`);
      return;
    }
    if (isTaskAlreadyExists) {
      const newHistoric = { ...historic };
      newHistoric[date][task.id] = task;
      delete newHistoric[date][task.id];
      console.log("new list : newHistoric", newHistoric[date]);
      setHistoric(newHistoric);
    }
  }

  return (
    <>
      <div className="container">
        <h2>Date : {date}</h2>
        {historic &&
          historic[date] &&
          Object.values(historic[date]).map((e: Task | string, index) => {
            if (typeof e === "string") {
              return null;
            }
            return (
              <div className="task" key={index}>
                <div className="title-inputs">
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
                      <button
                        className="message-error"
                        onClick={() => handleRemoveTask(e)}
                      >
                        X
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        <div className="buttons-container">
          <button className="add" onClick={backAndSendToDB}>
            Save modifcations
          </button>
          <TemporaryMessage message={messagelist} type="message-small" />
          <Link className="cancel" href="/historic">
            Cancel
          </Link>
        </div>
      </div>
      <div className="container">
        <h2>Forgot one ?</h2>
        <CustomTasks handleAddTask={handleAddTask} userId={user.uid} />
        <CommonTasks handleAddTask={handleAddTask} />
      </div>
    </>
  );
};

export default Page;
