"use client";

import Today from "@/components/Today";
import "./pageHome.css";
import CommonTasks from "@/components/CommonTasks";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchDataFromDBToLocalStorage } from "@/firebase/config";
import Footer from "@/components/Footer";

interface UserData {
  email: string;
  uid: string;
}

export default function Home() {
  const { user } = useAuthContext() as { user: UserData };

  const [userInfo, setUserInfo] = useState();

  /*  useEffect(() => {
    const userId = user ? user.uid : null;
    console.log(userId);
    const fetchData = async () => {
      try {
        const fetching = await fetchDataFromDBToLocalStorage("users", userId);
        setUserInfo(fetching);
      } catch (error) {
        console.error("Error fetching common tasks:", error);
      }
    };

    fetchData();
  }, []); */
  return (
    <>
      <main>
        <h1>Welcome {user && user.email} </h1>
        <h2>My list</h2>
        <p>ici la liste des tasks du jour ! </p>
        <Today />
        <h2>Common tasks</h2>
        <CommonTasks />
        <h2>CuSTOM tasks</h2>
        <p>ici la liste des tasks que l'utilisateur a créé</p>
      </main>
      <Footer />
    </>
  );
}
