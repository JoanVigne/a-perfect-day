import React, { useEffect, useState } from "react";
import { fetchOnlyThisIdToLocalStorage } from "@/firebase/db/db";
import TemporaryMessage from "@/components/TemporaryMessage";
import Load from "@/components/Load";
import Chall from "./Chall";
import FormCustomChall from "./FormCustomChall";
import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import ChallengeDisplay from "./ChallengeDisplay";

interface Props {
  handleAddChall: any;
  userId: string;
}
interface Task {
  [key: string]: any;
}
const CustomChallenges: React.FC<Props> = ({ handleAddChall, userId }) => {
  const [customChall, setCustomChall] = useState<{ [key: string]: any }>({});
  const fakeList = {
    "052432wee1..1dj4": {
      details: "La maniére la plus propre possible",
      id: "052432wee1..1dj4",
      count: "0",
      description: "à la barre",
      name: "Bench press",
      unit: "reps",
    },
    "0.j5nhlp56ha": {
      unit: "lourd",
      description:
        "untitre unp eul ong en bordel por des tests untitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des tests",
      id: "0.j5nhlp56ha",
      count: "0",
      details:
        "untitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des testsuntitre unp eul ong en bordel por des tests",
      name: "untitre unp eul ong en bordel por des tests",
    },
  };

  const [messageCustom, setMessageCustom] = useState<string | null>(null);

  const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(null);

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
    // EN ATTENDANT FETCH DB
    const local = localStorage.getItem("customChall");
    if (local === null) {
      return;
    }
    setCustomChall(JSON.parse(local));
    setLoadingTasks(false);
    // A FETCH QUAND ON A LA DB
    /*  fetchData(); */
  }, []);

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
      // envoi a la db custom
      /*       const mess = await removeFromCustom(updatedTasks, userId);
      setMessageCustom(mess); */
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
          <div key={index}>
            {/*         <Chall chall={chall} updateCustomChall={handleAddChall} /> */}
            <ChallengeDisplay
              challenge={chall}
              remove={true}
              removeConfirmation={handleRemoveTask}
              handleAddChall={handleAddChall}
            />
            {clickedItemIndex === index && taskToRemove && (
              <div className="modal-remove">
                <div className="modal-content">
                  <p>
                    Are you sure you want to delete "{chall.name}" for ever?
                  </p>
                  <div className="modal-buttons">
                    <button
                      onClick={handleConfirmRemoveTask}
                      className="confirm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setTaskToRemove(null)}
                      className="cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <FormCustomChall updateCustomChall={updateCustomChall} />
      <TemporaryMessage message={messageCustom} type="message-error" />
    </ul>
  );
};

export default CustomChallenges;
