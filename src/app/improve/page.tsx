"use client";
import CustomTasks from "@/components/CustomTasks";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import CustomChallenges from "./components/CustomChallenges";

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
}
const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [perfTask, setPerfTask] = useState<{ [key: string]: Task }>();
  function handleAddChallToPerfList(task: any) {
    console.log("fonction handleAddTaskToPerfList", task);
  }
  return (
    <div>
      <h1>IMPROVE</h1>
      <div className="container">
        <h2>Personal Records :</h2>
        <ul>
          {perfTask &&
            Object.values(perfTask).map((item, index) => {
              if (Object.keys(perfTask).length <= 0) {
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
                    <h3>un item</h3> score <button>I improved !</button>
                  </li>
                </div>
              );
            })}
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
