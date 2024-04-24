"use client";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import CardWorldRecord from "@/components/cards/CardWorldRecord";
import FormCustomChall from "@/components/forms/FormCustomChall";
import TemporaryMessage from "@/components/ui/TemporaryMessage";
import CardChallenge from "@/components/cards/CardChallenge";
import Load from "@/components/ui/Load";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import { getItemFromLocalStorage } from "@/utils/localstorage";

interface UserData {
  email: string;
  uid: string;
}
interface Task {
  [key: string]: any;
}
const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState("");
  const [customChall, setCustomChall] = useState<{ [key: string]: any }>({});
  const [messageCustom, setMessageCustom] = useState<string | null>(null);
  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetching = await fetchOnlyThisIdToLocalStorage(
          "customChall",
          user.uid
        );
        setCustomChall(fetching);
        setLoadingTasks(false);
      } catch (error) {
        console.error("Error fetching custom tasks:", error);
        setLoadingTasks(false);
      }
    };
    fetchData();
  }, []);
  // update :
  const updateCustomChall = (newChall: Task) => {
    console.log("new chall dans updatecustomchall : ", newChall);
    let list = getItemFromLocalStorage("customChall");
    setCustomChall(list);
    if (typeof list !== "object" || Array.isArray(list)) {
      console.log("type of : ", typeof list);
      console.error("List is not an object.");
      return;
    }
    if (list === null) {
      list = {};
    }
    const isTaskAlreadyExists = Object.values(list).some(
      (existingTask: Task | any) => existingTask?.name === newChall.name
    );
    if (isTaskAlreadyExists) {
      setMessageCustom(`Name is already taken`);
      return;
    }
    const updatedList = { ...list, [newChall.id]: newChall };
    console.log("UPDATED LIST :", updatedList);

    setCustomChall(updatedList);
    localStorage.setItem("customChall", JSON.stringify(updatedList));

    setMessageCustom(null);
  };
  // supprimer une custom :
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null);
  const handleRemoveTask = (task: Task, index: number) => {
    setClickedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    setTaskToRemove(task);
    return;
  };
  return (
    <div>
      <Header />
      <h1>IMPROVE</h1>
      <div className="container">
        <h2>My Challenges</h2>
        <ul>
          {loadingTasks ? (
            <Load />
          ) : (
            customChall &&
            Object.values(customChall).map((chall, index) => (
              <CardChallenge
                challenge={chall}
                remove={true}
                removeConfirmation={handleRemoveTask}
                key={index}
              />
            ))
          )}

          <FormCustomChall
            updateCustomChall={updateCustomChall}
            userid={user.uid}
          />
          <TemporaryMessage
            message={messageCustom}
            type="message-error"
            timeInMS={3000}
          />
        </ul>
      </div>

      <div className="container">
        <h2>World Records</h2>
        <CardWorldRecord />
      </div>
      <Footer />
    </div>
  );
};

export default page;
