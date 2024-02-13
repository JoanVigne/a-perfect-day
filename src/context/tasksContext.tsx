"use client";

import React, { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [listTasks, setListTasks] = useState();

  return (
    <TasksContext.Provider value={{ listTasks, setListTasks }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
