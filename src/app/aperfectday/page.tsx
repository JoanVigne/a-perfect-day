"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const [listTasks, setListTasks] = useState();

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
    <div>
      <h1>A perfect day</h1>
      <ul>
        {listTasks &&
          listTasks.map((userData, index) => (
            <li key={index}>
              {userData.user_id === 1 && (
                <h2>Bonjour user_id numero {userData.user_id}</h2>
              )}
              {/*   <strong>{userData.user_id}</strong> */}
              <ul>
                {userData.tasks.map((task) => (
                  <li key={task.id}>{task.title}</li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default page;
