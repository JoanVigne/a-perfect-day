"use client";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import ContainerChallenges from "./components/ContainerChallenges";
import Link from "next/link";
import Header from "@/components/Header";
import CardWorldRecord from "@/components/cards/CardWorldRecord";

interface UserData {
  email: string;
  uid: string;
}

const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState("");

  return (
    <div>
      <Header />
      <h1>IMPROVE</h1>
      <div className="container">
        <h2>My Challenges</h2>
        <ContainerChallenges userId={user?.uid} />
      </div>

      <div className="container">
        <h2>World Records</h2>
        <CardWorldRecord />
      </div>
      <Footer />
    </div>
  );
};

export default page;
