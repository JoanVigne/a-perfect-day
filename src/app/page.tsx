"use client";

import Today from "@/components/Today";
import "./pageHome.css";
import CommonTasks from "@/components/CommonTasks";

export default function Home() {
  return (
    <main>
      <h1>Listes des tasks</h1>
      <h2>My list</h2>
      <p>ici la liste des tasks du jour ! </p>
      <Today />
      <h2>Common tasks</h2>
      <CommonTasks />
      <h2>CuSTOM tasks</h2>
      <p>ici la liste des tasks que l'utilisateur a créé</p>
    </main>
  );
}
