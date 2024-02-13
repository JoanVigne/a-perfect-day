"use client";
import Link from "next/link";
import React from "react";
import "./tasks.css";
import { useTasks } from "@/context/tasksContext";

const page = () => {
  const { listTasks } = useTasks();
  return (
    <div>
      <h1>listes des tasks</h1>
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
    </div>
  );
};

export default page;
