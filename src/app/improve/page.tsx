"use client";
import CustomTasks from "@/components/CustomTasks";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import CustomChallenges from "./components/CustomChallenges";
import { getItemFromLocalStorage } from "../utils/localstorage";
import TemporaryMessage from "@/components/TemporaryMessage";

interface UserData {
  email: string;
  uid: string;
}
interface Task {
  unit: boolean | string;
  details: string;
  description: string;
  count: number | string;
  name: string;
  id: string;
  [key: string]: any;
}
const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState("");
  const [perfList, setperfList] = useState<{ [key: string]: Task }>();

  function handleAddChallToPerfList(task: any) {
    console.log("fonction handleAddTaskToPerfList", task);
    let list = getItemFromLocalStorage("challenges") as {
      [key: string]: any;
    };
    if (!list) {
      console.log("nothing in storage challenges");
      list = {};
    }
    setperfList(list);
    if (typeof list !== "object" || Array.isArray(list)) {
      console.error("list is not an object.");
      return;
    }
    const isTaskAlreadyExists = Object.values(list).some(
      (existingTask: Task) =>
        existingTask.name === task.name || existingTask.id === task.id
    );

    if (isTaskAlreadyExists) {
      setMessage(`"${task.name}" is already in the list`);
      return;
    }
    const updatedList = { ...list };
    updatedList[task.id] = task;
    setperfList(updatedList);
    localStorage.setItem("challenges", JSON.stringify(updatedList));
    setMessage("");
  }

  return (
    <div>
      <h1>IMPROVE</h1>
      <div className="container">
        <h2>Personal Records :</h2>
        <ul>
          {perfList &&
            Object.values(perfList).map((item, index) => {
              if (Object.keys(perfList).length <= 0) {
                return (
                  <p key={index}>
                    Your list is empty. You can add some tasks from the common
                    task list, or from your custom task list.
                  </p>
                );
              }
              // Si la clé est "date", on ne l'affiche pas
              if (typeof item === "string") {
                console.log('item === "string"');
                return null;
              }
              return (
                <div key={index}>
                  {" "}
                  <li className="task">
                    <h3>{item.name}</h3> score <button>I improved !</button>
                  </li>
                </div>
              );
            })}
          <TemporaryMessage message={message} type="error-message" />
          <p>
            nouvelle liste de chose auquel on a envie de voir la meilleur perf
          </p>
        </ul>
      </div>
      <div className="container">
        <h2>My Challenges</h2>
        <CustomChallenges
          handleAddChall={handleAddChallToPerfList}
          userId={user?.uid}
        />
      </div>
      <div className="container">
        <h2>My customs from "routine"</h2>
        <CustomTasks
          handleAddTask={handleAddChallToPerfList}
          userId={user?.uid}
        />
      </div>
      <div className="container">
        <p>LIENS VERS charts of progression of stuff improvement</p>
      </div>

      <div className="container">
        <h2>MY Exemples</h2>
        <div className="task-stat-container">
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
        </div>
      </div>
      <div className="container">
        <h2>World class heros</h2>
        <div className="task-stat-container">
          <div className="hero task-stat-card">
            <h3>Ron Hill </h3>
            <img src="" alt="photo" />
            <p>categorie : Sport</p>
            <p>ran for 19,032 consecutive days.</p>
            <p>stats</p>
          </div>
          <div className="hero task-stat-card">
            <h3>autre </h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero task-stat-card">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero task-stat-card">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
