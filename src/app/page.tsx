"use client";
import { useTasks } from "@/context/tasksContext";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
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
