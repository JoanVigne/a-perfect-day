"use client";
import { useTasks } from "@/context/tasksContext";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const data = {
    Users: [
      {
        pseudo: "user1",
        email: "user1@email.com",
        mot_de_passe: "**********",
        listes: { listetask: [1, 2, 3], autre: {} },
        todayTasksDone: [
          {
            nomDeLatask: "Nettoyer quelque chose",
            count: 1,
            unit: "fois",
            details: "Salle de bain",
          },
          {
            nomDeLatask: "S'étirer",
            count: 2,
            unit: "fois",
            details: "bas du dos et jambes",
          },
          {
            nomDeLatask: "Marcher dehors",
            count: 60,
            unit: "minutes",
            details: "",
          },
        ],
      },
      {
        pseudo: "user2",
        email: "user2@email.com",
        mot_de_passe: "**********",
        listes: { listetask: [2, 4], autre: {} },
      },
    ],
    TasksCommunes: [
      {
        id: 1,
        nom: "Tâche 1",
        description: "Description tâche 1",
        count: 0,
        done: false,
      },
      {
        id: 2,
        nom: "Tâche 2",
        description: "Description tâche 2",
        count: 0,
        done: false,
      },
      {
        id: 3,
        nom: "Tâche 3",
        description: "Description tâche 3",
        count: 0,
        done: false,
      },
    ],
    TasksPersonnalisees: [
      {
        id: 2,
        createur: "user2",
        nom: "Tâche X",
        description: "Description tâche personnalisée",
        count: 0,
        done: false,
      },
    ],
    historique: [
      {
        date: "format date classique",
        user: "user1",
        tasksDone: [
          {
            nomDeLatask: "Nettoyer quelque chose",
            count: 1,
            unit: "fois",
            details: "Salle de bain",
          },
          {
            nomDeLatask: "S'étirer",
            count: 2,
            unit: "fois",
            details: "bas du dos et jambes",
          },
          {
            nomDeLatask: "Marcher dehors",
            count: 60,
            unit: "minutes",
            details: "",
          },
        ],
      },
    ],
  };

  const { listTasks, setListTasks } = useTasks();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/tasks.json");
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const fetchedTasks = await res.json();
        setListTasks(fetchedTasks.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <main>
      <h1>Listes des tasks</h1>
      <ul>
        {listTasks &&
          listTasks.map((userData, index) => (
            <li key={index}>
              <strong>user numero : {userData.user_id}</strong>
              <ul>
                {userData.tasks.map((task) => (
                  <li key={task.id}>
                    <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </main>
  );
}
