import React, { useEffect, useState } from "react";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import TemporaryMessage from "@/components/ui/TemporaryMessage";
import Load from "@/components/ui/Load";

import FormCustomChall from "../../../components/forms/FormCustomChall";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import CardChallenge from "../../../components/cards/CardChallenge";
import { removeFromChall } from "@/firebase/db/chall";

interface Props {
  userId: string;
}
interface Task {
  [key: string]: any;
}
const CustomChallenges: React.FC<Props> = ({ userId }) => {
  const [customChall, setCustomChall] = useState<{ [key: string]: any }>({});
  const [messageCustom, setMessageCustom] = useState<string | null>(null);
  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetching = await fetchOnlyThisIdToLocalStorage(
          "customChall",
          userId
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
  const [forceUpdate, setForceUpdate] = useState(false);
  const handleConfirmRemoveTask = async () => {
    if (taskToRemove && taskToRemove.id !== undefined) {
      // Créer une copie de customTasks
      const updatedTasks = { ...customChall };

      // Supprimer la tâche avec l'ID correspondant de la copie de customTasks
      Object.keys(updatedTasks).forEach((key) => {
        const taskKey = key as keyof typeof updatedTasks;
        if (taskKey === taskToRemove?.id) {
          delete updatedTasks[taskKey];
        }
      });
      console.log("updated chall", updatedTasks);
      setTaskToRemove(null);
      return;
      const mess = await removeFromChall(updatedTasks, userId);
      setMessageCustom(mess);
      setCustomChall(updatedTasks);
      setForceUpdate((prev) => !prev);
    }
  };

  return (
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

      <FormCustomChall updateCustomChall={updateCustomChall} userid={userId} />
      <TemporaryMessage
        message={messageCustom}
        type="message-error"
        timeInMS={3000}
      />
    </ul>
  );
};

export default CustomChallenges;
