"use client";
import { Router } from "next/router";
import React, { useEffect, useState } from "react";

const page = ({ params }: { params: { taskid: string } }) => {
  const { taskid } = params;
  // A GARDER POUR GERER LES PROFILES PLUS TARD
  return (
    <div>
      <h1>task id : {taskid}</h1>
    </div>
  );
};

export default page;
