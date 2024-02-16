"use client";
import Link from "next/link";
import React from "react";
import "./tasks.css";

const page = () => {
  // a garder pour gerer les profiles plus tard
  return (
    <div>
      <h1>listes des tasks</h1>
      <ul>
        {/*  {listTasks &&
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
          ))} */}
      </ul>
    </div>
  );
};

export default page;
